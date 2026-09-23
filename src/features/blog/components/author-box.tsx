import type { Author } from "../types/blog.types";

export function AuthorBox({ author, publishedLabel }: { author: Author; publishedLabel: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-card p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
        {author.name.charAt(0)}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{author.name}</p>
        <p className="text-xs text-foreground/50">
          {author.role} · {publishedLabel}
        </p>
      </div>
    </div>
  );
}