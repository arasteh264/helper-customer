import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "../features/provider/AuthSessionProvider";
import { ServiceWorkerRegistration } from "./service-worker-registration";
import { PwaInstallPrompt } from "./pwa-install-prompt";

const vazirmatn = localFont({
  src: [
    {
      path: "../assets/fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "هلپا24",
  title: "Helpa24 | خدمات آنلاین شما",
  description: "مارکت‌پلیس خدمات هلپا24",
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
    title: "هلپا24",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b9b89",
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
