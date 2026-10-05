import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "../features/provider/AuthSessionProvider";
import { ServiceWorkerRegistration } from "./service-worker-registration";
import { PwaInstallPrompt } from "./pwa-install-prompt";

const vazirmatn = localFont({
  src: "../assets/fonts/Vazirmatn[wght].woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  applicationName: "هلپر",
  title: "Helper | خدمات آنلاین شما",
  description: "مارکت‌پلیس خدمات هلپر",
  icons: {
    icon: [{ url: "/icons/helper.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/icons/helper-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "هلپر",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f7a5c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className={`${vazirmatn.variable}`}>
        <AuthSessionProvider>
          <QueryProvider>
            {children}
            <ServiceWorkerRegistration />
            <PwaInstallPrompt />
          </QueryProvider>
        </AuthSessionProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
