type Props = {
  slug: string;
  className?: string;
};

const safeSlug = (slug: string) => {
  const value = slug?.trim().toLowerCase();
  return value && value !== "undefined" ? value : "default";
};

export function CategorySvgIcon({ slug, className = "h-8 w-8" }: Props) {
  const symbolId = safeSlug(slug);

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href={`/icons/category-sprite.svg#${symbolId}`} />
    </svg>
  );
}
