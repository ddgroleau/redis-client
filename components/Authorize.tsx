import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/auth";

export default async function Authorize({
  children,
  returnUri,
}: {
  children: React.ReactNode;
  returnUri?: string;
}) {
  const idToken = await getTokenCookie();

  if (idToken) {
    return <>{children}</>;
  }

  redirect("/api/auth" + (!returnUri ? "" : `?returnUri=${returnUri}`));
}
