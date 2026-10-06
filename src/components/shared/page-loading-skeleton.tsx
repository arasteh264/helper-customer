type PageLoadingSkeletonProps = {
  variant?: "panel" | "catalog" | "page";
};

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl border border-foreground/10 bg-gradient-to-r from-foreground/[0.04] via-foreground/[0.08] to-foreground/[0.04] ${className}`}
    />
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-7 w-48" />
      <SkeletonBlock className="h-4 w-72 max-w-full" />
    </div>
  );
}

function LandingPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-foreground/10 bg-card p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-12 w-full max-w-xl" />
            <SkeletonBlock className="h-4 w-full max-w-lg" />
            <SkeletonBlock className="h-4 w-4/5 max-w-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <SkeletonBlock className="h-11 w-32" />
              <SkeletonBlock className="h-11 w-28" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-foreground/10 bg-card p-4"
          >
            <SkeletonBlock className="mb-3 h-10 w-10 rounded-full" />
            <SkeletonBlock className="mb-2 h-4 w-20" />
            <SkeletonBlock className="h-7 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5">
          <SectionHeaderSkeleton />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <SkeletonBlock className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-2/3" />
                  <SkeletonBlock className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5">
          <SectionHeaderSkeleton />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelPageSkeleton() {
  return (
    <div className="space-y-6">
      <SectionHeaderSkeleton />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-foreground/10 bg-card p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
              <SkeletonBlock className="h-3 w-12 rounded-full" />
            </div>
            <SkeletonBlock className="mb-2 h-4 w-2/3" />
            <SkeletonBlock className="h-7 w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5">
          <SectionHeaderSkeleton />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <SkeletonBlock className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-2/3" />
                  <SkeletonBlock className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5">
          <SectionHeaderSkeleton />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <SkeletonBlock className="h-4 w-1/2" />
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-xl rounded-2xl border border-foreground/10 bg-card p-3">
        <SkeletonBlock className="h-12 w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[22px] border border-foreground/10 bg-card p-3"
          >
            <SkeletonBlock className="mb-3 h-40 w-full rounded-xl" />
            <SkeletonBlock className="mb-2 h-4 w-2/3" />
            <SkeletonBlock className="mb-3 h-3 w-1/2" />
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-8 w-20 rounded-xl" />
              <SkeletonBlock className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageLoadingSkeleton({
  variant = "page",
}: PageLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری صفحه"
      className="w-full"
    >
      <span className="sr-only">در حال بارگذاری…</span>
      {variant === "panel" ? (
        <PanelPageSkeleton />
      ) : variant === "catalog" ? (
        <CatalogPageSkeleton />
      ) : variant === "page" ? (
        <LandingPageSkeleton />
      ) : null}
    </div>
  );
}
