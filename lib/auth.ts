"use server";
import {
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  Configuration,
  CryptoProvider,
} from "@azure/msal-node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getConfidentialClientApplication(): ConfidentialClientApplication {
  const confidentialClientConfig: Configuration = {
    auth: {
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID ?? "",
      authority: process.env.AZURE_AD_B2C_AUTHORITY,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
      knownAuthorities: [process.env.AZURE_AD_B2C_KNOWN_AUTHORITY_1 ?? ""],
    },
  };
  return new ConfidentialClientApplication(confidentialClientConfig);
}

function getBaseAuthRequest() {
  return {
    redirectUri: process.env.AZURE_AD_B2C_REDIRECT_URI ?? "",
    authority: process.env.AZURE_AD_B2C_AUTHORITY,
    scopes: ["openid"],
  };
}

export async function redirectToAuth(returnUri: string) {
  const { challenge } = await new CryptoProvider().generatePkceCodes();
  const req: AuthorizationUrlRequest = {
    ...getBaseAuthRequest(),
    codeChallenge: challenge,
    state: returnUri,
  };

  const response = await getConfidentialClientApplication()
    .getAuthCodeUrl(req)
    .catch((error) => {
      console.error(error);
    });
  if (response) {
    redirect(response);
  }
}

export async function getToken(code: string) {
  const { verifier } = await new CryptoProvider().generatePkceCodes();
  const req: AuthorizationCodeRequest = {
    ...getBaseAuthRequest(),
    code,
    codeVerifier: verifier,
  };
  const response = await getConfidentialClientApplication()
    .acquireTokenByCode(req)
    .catch((error) => {
      console.error(error);
    });
  if (response && response.idToken) {
    cookies().set({
      name: "id-token",
      value: response.idToken,
      httpOnly: true,
    });
    return response;
  }
  return undefined;
}

export async function getTokenCookie() {
  return cookies().get("id-token");
}
