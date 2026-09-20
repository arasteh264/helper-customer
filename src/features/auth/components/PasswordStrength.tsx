
export function getPasswordStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  return score;
}

const META = [
  { label: "", bar: "" },
  { label: "ضعیف", bar: "bg-destructive" },
  { label: "متوسط", bar: "bg-amber-500" },
  { label: "خوب", bar: "bg-lime-500" },
  { label: "قوی", bar: "bg-green-600" },
];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={[
              "h-1.5 flex-1 rounded-full transition-colors",
              level <= strength ? META[strength].bar : "bg-foreground/10",
            ].join(" ")}
          />
        ))}
      </div>
      <span className="w-10 text-xs text-foreground/60">
        {META[strength].label}
      </span>
    </div>
  );
}