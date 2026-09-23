import { auth } from "../../auth";
import { SiteHeader } from "../../components/layout/header/site-header";
import { SiteFooter } from "../../components/layout/footer/site-footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SiteHeader
        user={session?.user ? { name: session.user.name ?? "کاربر" } : null}
      />
      {children}
      <SiteFooter />
    </>
  );
}
