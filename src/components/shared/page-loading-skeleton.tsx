type PageLoadingSkeletonProps = {
  variant?: "panel" | "catalog" | "page";
};

export function PageLoadingSkeleton({
  variant = "page",
}: PageLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری صفحه"
      className="space-y-6"
    >
      <span className="sr-only">در حال بارگذاری…</span>
      <div aria-hidden="true" className="animate-pulse space-y-3">
        <div className="h-8 w-48 rounded-lg bg-foreground/[0.08]" />
        <div className="h-4 w-72 max-w-full rounded-md bg-foreground/[0.06]" />

        {variant === "panel" ? (
          <>
            <div className="grid grid-cols-2 gap-3 pt-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl border border-foreground/10 bg-card"
                />
              ))}
            </div>
            <div className="grid gap-4 pt-2 lg:grid-cols-2">
              <div className="h-64 rounded-2xl border border-foreground/10 bg-card" />
              <div className="h-64 rounded-2xl border border-foreground/10 bg-card" />
            </div>
          </>
        ) : variant === "catalog" ? (
          <>
            <div className="mx-auto mt-6 h-12 max-w-lg rounded-xl border border-foreground/10 bg-card" />
            <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-44 rounded-2xl border border-foreground/10 bg-card"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 rounded-2xl border border-foreground/10 bg-card" />
        )}
      </div>
    </div>
  );
}
