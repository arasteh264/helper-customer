import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-foreground/10 bg-card p-7 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <WifiOff size={25} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-foreground">
          اتصال اینترنت برقرار نیست
        </h1>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          برای بارگذاری اطلاعات و پنل‌ها دوباره به اینترنت وصل شوید.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          تلاش دوباره
        </Link>
      </section>
    </main>
  );
}
