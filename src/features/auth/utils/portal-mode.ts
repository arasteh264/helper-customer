export type PortalMode = "CUSTOMER" | "PROVIDER";

const PORTAL_MODE_COOKIE = "helper-portal-mode";
const PORTAL_MODE_EVENT = "helper-portal-mode-change";

export function setPortalMode(mode: PortalMode) {
  document.cookie = `${PORTAL_MODE_COOKIE}=${mode.toLowerCase()}; path=/; samesite=lax`;
  window.dispatchEvent(new Event(PORTAL_MODE_EVENT));
}

export function getPortalMode(): PortalMode | null {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${PORTAL_MODE_COOKIE}=`))
    ?.split("=")[1]
    ?.toUpperCase();

  return value === "CUSTOMER" || value === "PROVIDER" ? value : null;
}

export function clearPortalMode() {
  document.cookie = `${PORTAL_MODE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  window.dispatchEvent(new Event(PORTAL_MODE_EVENT));
}

export function subscribePortalMode(onChange: () => void) {
  window.addEventListener(PORTAL_MODE_EVENT, onChange);
  return () => window.removeEventListener(PORTAL_MODE_EVENT, onChange);
}
