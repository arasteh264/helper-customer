import { Lightbulb } from "lucide-react";

import type { ContentBlock } from "../types/blog.types";

export function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="pt-2 text-lg font-bold text-foreground sm:text-xl">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="text-sm leading-8 text-foreground/75 sm:text-base sm:leading-8">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2 ps-1">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-7 text-foreground/75 sm:text-base">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "tip":
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Lightbulb size={16} />
                </span>
                <p className="text-sm leading-7 text-foreground/80">{block.text}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}