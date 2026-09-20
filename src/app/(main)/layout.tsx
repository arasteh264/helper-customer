import { SiteHeader } from "../../components/layout/header/site-header";
import { SiteFooter } from "../../components/layout/footer/site-footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {/* user={user} */}
      {children}
      <SiteFooter />
    </>
  );
}