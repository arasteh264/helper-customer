import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";

const vazirmatn = localFont({
  src: "../assets/fonts/Vazirmatn-RD[wght].woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Helper | خدمات آنلاین شما",
  description: "مارکت‌پلیس خدمات هلپر",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className={`${vazirmatn.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}