"use server";
import {
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  Configuration,
  CryptoProvider,
  PublicClientApplication,
} from "@azure/msal-node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const config: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID ?? "",
    authority: process.env.AZURE_AD_B2C_AUTHORITY,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
    knownAuthorities: [process.env.AZURE_AD_B2C_KNOWN_AUTHORITY_1 ?? ""],
  },
};
const confidentialClientApp = new ConfidentialClientApplication(config);
const publicClientApp = new PublicClientApplication(config);
const cryptoProvider = new CryptoProvider();
let pkceCodes = {
  challenge: "",
  verifier: "",
};

const baseAuthRequest = {
  redirectUri: process.env.AZURE_AD_B2C_REDIRECT_URI ?? "",
  authority: process.env.AZURE_AD_B2C_AUTHORITY,
  scopes: [
    "openid",
    "offline_access",
    process.env.AZURE_AD_B2C_TODOS_WRITE_SCOPE ?? "",
  ],
};

async function setPkceCodes() {
  pkceCodes = await cryptoProvider.generatePkceCodes();
}

export async function redirectToAuth(returnUri: string) {
  if (!pkceCodes.challenge || !pkceCodes.verifier) await setPkceCodes();
  const req: AuthorizationUrlRequest = {
    ...baseAuthRequest,
    codeChallenge: pkceCodes.challenge,
    state: returnUri,
    codeChallengeMethod: "S256",
  };
  const response = await confidentialClientApp
    .getAuthCodeUrl(req)
    .catch((error) => {
      console.error(error);
      redirect("/error");
    });
  if (response) {
    redirect(response);
  }
}

export async function getToken(code: string) {
  if (!pkceCodes.challenge || !pkceCodes.verifier) await setPkceCodes();
  const req: AuthorizationCodeRequest = {
    ...baseAuthRequest,
    code,
    codeVerifier: pkceCodes.verifier,
  };
  const response = await publicClientApp
    .acquireTokenByCode(req)
    .catch((error) => {
      console.error(error);
      redirect("/error");
    });
  if (response && response.idToken) {
    const claims: { exp?: number } = response.idTokenClaims;
    const expires = new Date((claims.exp ?? 1) * 1000);
    cookies().set({
      name: "access-token",
      value: response.accessToken,
      httpOnly: true,
      expires: expires,
    });
    return response;
  }

  return undefined;
}

export async function getTokenCookie() {
  return cookies().get("access-token");
}
