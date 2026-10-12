import { auth } from "../../auth";
import { cookies } from "next/headers";
import { SiteHeader } from "../../components/layout/header/site-header";
import { SiteFooter } from "../../components/layout/footer/site-footer";
import { requestApi } from "@/src/features/request/api/request.api";
import { normalizeSpecialtyGroup } from "@/src/features/catalog/utils/category-mapping";
import {
  fallbackServiceMenuItems,
  getServiceIconKey,
  type ServiceMenuItem,
} from "@/src/components/layout/header/nav-data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const portalModeCookie = (await cookies()).get("helper-portal-mode")?.value;
  const normalizedPortalMode = portalModeCookie?.toUpperCase();
  const isProvider = session?.user.role?.toUpperCase() === "PROVIDER";
  const portalMode =
    isProvider && normalizedPortalMode === "CUSTOMER"
      ? "CUSTOMER"
      : isProvider
        ? "PROVIDER"
        : "CUSTOMER";
  let serviceItems: ServiceMenuItem[] = [];
  try {
    serviceItems = (await requestApi.getSpecialtyGroups()).map((group) => {
      const category = normalizeSpecialtyGroup(group);
      return {
        label: category.label,
        description: `مشاهده‌ی خدمات ${category.label}`,
        href: category.href,
        icon: getServiceIconKey(category.svgKey),
        tint: category.tint,
      };
    });
  } catch (error) {
    console.error("Service categories could not be loaded for navigation", error);
    serviceItems = fallbackServiceMenuItems;
  }

  return (
    <>
      <SiteHeader
        user={
          session?.user
            ? {
                name: session.user.name ?? "کاربر",
                role: session.user.role,
                image: session.user.image,
                portalMode,
              }
            : null
        }
        serviceItems={serviceItems}
      />
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <SiteFooter serviceItems={serviceItems} />
    </>
  );
}
