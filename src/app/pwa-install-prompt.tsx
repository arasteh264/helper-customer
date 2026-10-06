"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Plus, Share, Smartphone, X } from "lucide-react";

const INSTALL_CHOICE_KEY = "helper:pwa-install-choice";

type InstallChoice = "dismissed" | "installed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

function getDeviceSupport(): { isIOS: boolean; isPhoneOrTablet: boolean } {
  const userAgent = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  const isTouchTablet = window.matchMedia(
    "(max-width: 1024px) and (any-pointer: coarse)",
  ).matches;

  return {
    isIOS,
    isPhoneOrTablet: isIOS || isAndroid || isTouchTablet,
  };
}

function readInstallChoice(): InstallChoice | null {
  try {
    const choice = window.localStorage.getItem(INSTALL_CHOICE_KEY);
    return choice === "dismissed" || choice === "installed" ? choice : null;
  } catch {
    return null;
  }
}

function saveInstallChoice(choice: InstallChoice) {
  try {
    window.localStorage.setItem(INSTALL_CHOICE_KEY, choice);
  } catch {
    console.warn("Could not save the PWA installation choice.");
  }
}

export function PwaInstallPrompt() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canInstallNatively, setCanInstallNatively] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isInstalled() || readInstallChoice()) return;

    const device = getDeviceSupport();
    if (!device.isPhoneOrTablet) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setCanInstallNatively(true);
      setIsIOS(device.isIOS);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      saveInstallChoice("installed");
      setIsVisible(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isVisible && !dialog.open) {
      dialog.showModal();
    } else if (!isVisible && dialog.open) {
      dialog.close();
    }
  }, [isVisible]);

  function dismissPrompt() {
    saveInstallChoice("dismissed");
    setIsVisible(false);
  }

  async function installApp() {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPromptRef.current = null;
    setCanInstallNatively(false);

    if (outcome === "accepted") {
      saveInstallChoice("installed");
      setIsVisible(false);
    }
  }

  function handleDialogClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dismissPrompt();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
      className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none rounded-t-[2rem] border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-slate-950/50 sm:inset-0 sm:m-auto sm:w-[min(92vw,28rem)] sm:rounded-[2rem]"
      onCancel={(event) => {
        event.preventDefault();
        dismissPrompt();
      }}
      onClick={handleDialogClick}
    >
      <div className="relative overflow-hidden rounded-t-[2rem] bg-background px-6 pb-7 pt-8 sm:rounded-[2rem] sm:px-8 sm:pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-primary/10 blur-3xl"
        />
        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="بستن پنجره نصب"
          className="absolute left-5 top-5 z-10 flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/75"
        >
          <X className="size-5" />
        </button>

        <div className="relative">
          <div className="mb-5 flex size-16 items-center justify-center rounded-[1.35rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Smartphone className="size-8" strokeWidth={1.8} />
          </div>

          <p className="mb-2 text-sm font-semibold text-primary">
            هلپر، همیشه دم دست
          </p>
          <h2
            id="pwa-install-title"
            className="text-2xl font-black leading-tight"
          >
            {showInstructions
              ? "چطور هلپر را نصب کنید؟"
              : "می‌خواهید هلپر را نصب کنید؟"}
          </h2>
          <p
            id="pwa-install-description"
            className="mt-3 text-sm leading-7 text-muted-foreground"
          >
            {showInstructions
              ? "در چند قدم کوتاه، میان‌بُر هلپر را روی صفحه‌ی اصلی گوشی بسازید."
              : "میان‌بُر هلپر را روی صفحه‌ی اصلی بگذارید تا برای ثبت و پیگیری درخواست‌ها همیشه دم دست‌تان باشد؛ بدون دانلود از فروشگاه."}
          </p>

          {showInstructions ? (
            <ol className="mt-6 grid gap-3">
              {isIOS ? (
                <>
                  <InstallStep
                    number="۱"
                    icon={<Share className="size-5" />}
                    text="در نوار مرورگر روی دکمه‌ی اشتراک‌گذاری بزنید."
                  />
                  <InstallStep
                    number="۲"
                    icon={<Plus className="size-5" />}
                    text="گزینه‌ی «افزودن به صفحه‌ی اصلی» را انتخاب کنید."
                  />
                  <InstallStep
                    number="۳"
                    icon={<Check className="size-5" />}
                    text="بالا روی «افزودن» بزنید؛ آیکن هلپر به صفحه‌ی اصلی می‌آید."
                  />
                </>
              ) : (
                <>
                  <InstallStep
                    number="۱"
                    icon={<span className="text-lg font-bold">⋮</span>}
                    text="منوی مرورگر را در بالای صفحه باز کنید."
                  />
                  <InstallStep
                    number="۲"
                    icon={<Download className="size-5" />}
                    text="«نصب برنامه» یا «افزودن به صفحه‌ی اصلی» را بزنید."
                  />
                  <InstallStep
                    number="۳"
                    icon={<Check className="size-5" />}
                    text="در پنجره‌ی مرورگر، نصب را تأیید کنید."
                  />
                </>
              )}
            </ol>
          ) : null}

          <div className="mt-7 grid gap-3">
            <button
              type="button"
              onClick={
                showInstructions
                  ? dismissPrompt
                  : canInstallNatively && !isIOS
                  ? () => void installApp()
                  : () => setShowInstructions(true)
              }
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {showInstructions ? (
                "متوجه شدم"
              ) : canInstallNatively && !isIOS ? (
                <>
                  <Download className="size-5" />
                  نصب هلپر
                </>
              ) : (
                isIOS ? "بله، راهنمای نصب" : "راهنمای نصب"
              )}
            </button>
            {!showInstructions ? (
              <button
                type="button"
                onClick={dismissPrompt}
                className="min-h-11 rounded-2xl px-5 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                فعلاً نه
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            رایگان است و هر زمان خواستید می‌توانید حذفش کنید.
          </p>
        </div>
      </div>
    </dialog>
  );
}

function InstallStep({
  number,
  icon,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-6">{text}</span>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
        {number}
      </span>
    </li>
  );
}
