"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileUp,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type {
  VerificationDoc,
  VerificationStatus,
} from "../../types/provider.types";
import { VERIFICATION_STATUS } from "../../utils/job-status";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import {
  getVerificationDocuments,
  uploadVerificationDocument,
} from "../../api/documents";

const MAX_SIZE = 5 * 1024 * 1024;

const ICONS: Record<VerificationStatus, { icon: LucideIcon; cls: string }> = {
  verified: { icon: CheckCircle2, cls: "bg-green-600/10 text-green-700" },
  pending: { icon: Clock3, cls: "bg-amber-500/15 text-amber-700" },
  rejected: { icon: AlertCircle, cls: "bg-destructive/10 text-destructive" },
  missing: { icon: FileUp, cls: "bg-foreground/[0.06] text-foreground/50" },
};

function normalizeVerificationStatus(status: unknown): VerificationStatus {
  switch (
    String(status ?? "")
      .trim()
      .toLowerCase()
  ) {
    case "verified":
    case "approved":
      return "verified";
    case "pending":
    case "under_review":
    case "in_review":
      return "pending";
    case "rejected":
    case "declined":
      return "rejected";
    case "missing":
    case "not_uploaded":
    case "not_submitted":
      return "missing";
    default:
      return "missing";
  }
}

export function VerificationSection({
  docs: initial,
}: {
  docs: VerificationDoc[];
}) {
  const { data: session, status: sessionStatus } = useSession();
  const [docs, setDocs] = useState(() =>
    initial.map((doc) => ({
      ...doc,
      status: normalizeVerificationStatus(doc.status),
    })),
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated" || !session?.accessToken) return;

    getVerificationDocuments(session.accessToken)
      .then((remote) => {
        setDocs((previous) =>
          previous.map((doc) => {
            const match = remote.find((item) => item.type === doc.id);
            return match
              ? {
                  ...doc,
                  status: normalizeVerificationStatus(match.status),
                  note: match.note,
                }
              : doc;
          }),
        );
      })
      .catch(() => toast.error("دریافت وضعیت مدارک با مشکل مواجه شد"));
  }, [sessionStatus, session?.accessToken]);

  const onUpload = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validType =
      file.type.startsWith("image/") || file.type === "application/pdf";
    if (!validType) {
      toast.error("فقط تصویر یا فایل PDF مجاز است");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد");
      return;
    }
    if (!session?.accessToken) {
      toast.error("برای بارگذاری مدرک وارد حساب خود شوید");
      return;
    }

    setUploadingId(id);
    try {
      await uploadVerificationDocument(id, file, session.accessToken);
      setDocs((previous) =>
        previous.map((doc) =>
          doc.id === id ? { ...doc, status: "pending", note: undefined } : doc,
        ),
      );
      toast.success("مدرک بارگذاری شد و در انتظار بررسی است");
    } catch {
      toast.error("بارگذاری مدرک با مشکل مواجه شد");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <SectionCard
      id="documents"
      title="احراز هویت و مدارک"
      description="مدارک تأییدشده باعث می‌شود نشان «تأییدشده» بگیرید و مشتریان بیشتر اعتماد کنند."
    >
      <ul className="space-y-3">
        {docs.map((doc) => {
          const statusKey = normalizeVerificationStatus(doc.status);
          const status = VERIFICATION_STATUS[statusKey];
          const { icon: Icon, cls } = ICONS[statusKey];
          const canUpload = statusKey === "missing" || statusKey === "rejected";
          const isUploading = uploadingId === doc.id;

          return (
            <li
              key={doc.id}
              className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-background p-4 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cls}`}
                >
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {doc.label}
                    </h3>
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-foreground/55">
                    {doc.description}
                  </p>
                  {statusKey === "rejected" && doc.note && (
                    <p className="mt-2 rounded-lg bg-destructive/5 px-3 py-2 text-xs leading-6 text-destructive">
                      {doc.note}
                    </p>
                  )}
                </div>
              </div>

              {canUpload && (
                <div className="shrink-0">
                  <input
                    id={`doc-${doc.id}`}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(event) => onUpload(doc.id, event)}
                    disabled={isUploading}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`doc-${doc.id}`}
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
                  >
                    {isUploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <FileUp size={16} />
                    )}
                    {statusKey === "rejected" ? "بارگذاری مجدد" : "بارگذاری"}
                  </label>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-foreground/50">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
        مدارک شما فقط برای تأیید هویت استفاده می‌شود و برای مشتریان نمایش داده
        نمی‌شود.
      </p>
    </SectionCard>
  );
}
