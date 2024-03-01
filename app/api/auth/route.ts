import { redirectToAuth, getToken, getTokenCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idToken = await getTokenCookie();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const returnUri =
    searchParams.get("returnUri") ?? searchParams.get("state") ?? "/";

  /* 
    The return URI will initially be passed to this route. 
    If there is no id token present, execute the Auth Code flow, 
    passing the return URI as the state value. 
    When Azure AD B2C redirects back to this route, 
    read state as the return URI and redirect the user there. 
  */
  if (idToken) {
    redirect(returnUri);
  }
  if (searchParams && code) {
    const response = await getToken(code ?? "");
    if (response && response.idToken) {
      redirect(returnUri ?? "/");
    }
  } else if (!code || !!error) {
    await redirectToAuth(returnUri);
  }
  redirect("/");
}
