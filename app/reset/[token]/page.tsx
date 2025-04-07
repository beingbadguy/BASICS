import ResetPage from "./ResetPage";

export default async function page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // console.log(token + "Comming in page.tsx");
  return <ResetPage token={token} />;
}
