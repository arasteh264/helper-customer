"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Star,
  Wrench,
  Sparkles,
  Zap,
  Truck,
} from "lucide-react";

const specialists = [
  {
    name: "رضا محمدی",
    role: "لوله‌کش ساختمان",
    task: "تعویض شیر فلکه",
    icon: Wrench,
    anim: "sc-wrench",
    rating: "۴.۹",
    percent: 72,
    percentLabel: "۷۲٪",
    pos: "top-0 right-0",
    z: "70px",
    px: "16px",
    delay: "0s",
  },
  {
    name: "مریم کاظمی",
    role: "نظافتچی منزل",
    task: "نظافت واحد ۸۵ متری",
    icon: Sparkles,
    anim: "sc-sparkle",
    rating: "۴.۸",
    percent: 45,
    percentLabel: "۴۵٪",
    pos: "top-[88px] left-0",
    z: "20px",
    px: "8px",
    delay: "-1.2s",
  },
  {
    name: "علی رستمی",
    role: "برق‌کار ساختمان",
    task: "اصلاح تابلو برق",
    icon: Zap,
    anim: "sc-zap",
    rating: "۴.۹",
    percent: 88,
    percentLabel: "۸۸٪",
    pos: "top-[176px] right-3",
    z: "110px",
    px: "26px",
    delay: "-2.4s",
  },
  {
    name: "سعید نوری",
    role: "اسباب‌کشی",
    task: "بارگیری لوازم",
    icon: Truck,
    anim: "sc-truck",
    rating: "۴.۷",
    percent: 30,
    percentLabel: "۳۰٪",
    pos: "top-[264px] left-3",
    z: "50px",
    px: "12px",
    delay: "-3.6s",
  },
];

const css = `
.sc-stage{transform:rotateX(calc(var(--my,0)*-9deg)) rotateY(calc(var(--mx,0)*13deg));will-change:transform}
.sc-layer{transform:translate3d(calc(var(--mx,0)*var(--px,0px)),calc(var(--my,0)*var(--px,0px)),var(--z,0px))}
.sc-card{box-shadow:calc(var(--mx,0)*-14px) calc(var(--my,0)*-14px + 18px) 36px rgb(0 0 0/.25)}
.sc-float{animation:sc-float 5s ease-in-out infinite}
.sc-bar{width:var(--p);animation:sc-bar 5s ease-in-out infinite alternate}
.sc-wrench{transform-origin:30% 70%;animation:sc-wrench 1.1s ease-in-out infinite}
.sc-sparkle{animation:sc-sparkle 1.4s ease-in-out infinite}
.sc-zap{animation:sc-zap 1.6s linear infinite}
.sc-truck{animation:sc-truck .8s ease-in-out infinite alternate}
@keyframes sc-float{0%,100%{translate:0 0}50%{translate:0 -6px}}
@keyframes sc-bar{from{width:10%}to{width:var(--p)}}
@keyframes sc-wrench{0%,100%{rotate:-22deg}50%{rotate:22deg}}
@keyframes sc-sparkle{0%,100%{scale:1;opacity:1}50%{scale:1.3;opacity:.55}}
@keyframes sc-zap{0%,44%,56%,100%{opacity:1}50%{opacity:.25}70%{opacity:.45}75%{opacity:1}}
@keyframes sc-truck{from{translate:-2px 0}to{translate:2px 0}}
@media (prefers-reduced-motion:reduce){
  .sc-float,.sc-wrench,.sc-sparkle,.sc-zap,.sc-truck{animation:none}
  .sc-bar{animation:none}
}
`;

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

export default function SpecialistsScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const area = wrap.closest("aside") ?? wrap;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let active = false;
    let raf = 0;

    const onMove = (e: Event) => {
      const { clientX, clientY } = e as PointerEvent;
      const r = area.getBoundingClientRect();
      target.x = clamp((clientX - (r.left + r.width / 2)) / (r.width / 2));
      target.y = clamp((clientY - (r.top + r.height / 2)) / (r.height / 2));
      active = true;
    };
    const onLeave = () => {
      active = false;
    };

    const tick = (t: number) => {
      if (!active) {
        target.x = Math.sin(t / 2200) * 0.35;
        target.y = Math.cos(t / 2800) * 0.25;
      }
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      stage.style.setProperty("--mx", cur.x.toFixed(3));
      stage.style.setProperty("--my", cur.y.toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="[perspective:1100px]">
      <style>{css}</style>

      <div
        ref={stageRef}
        className="sc-stage relative h-[356px] [transform-style:preserve-3d]"
      >
        <div
          aria-hidden
          className="sc-layer absolute -inset-x-3 inset-y-0 rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5"
          style={{ "--z": "-90px", "--px": "-20px" } as CSSProperties}
        />

        {specialists.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className={`sc-layer absolute w-[64%] [transform-style:preserve-3d] ${s.pos}`}
              style={{ "--z": s.z, "--px": s.px } as CSSProperties}
            >
              <div
                className="sc-card sc-float relative rounded-2xl bg-background p-2.5 text-foreground [transform-style:preserve-3d]"
                style={{ animationDelay: s.delay }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0 [transform:translateZ(26px)]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {s.name[0]}
                    </span>
                    <span className="absolute -bottom-0.5 -left-0.5 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-xs font-semibold">{s.name}</p>
                      <BadgeCheck size={14} className="shrink-0 text-primary" />
                    </div>
                    <p className="truncate text-[11px] text-foreground/60">
                      {s.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-600">
                    <Star size={10} className="fill-current" />
                    {s.rating}
                  </div>
                </div>

                <div className="mt-2.5 [transform:translateZ(12px)]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon size={13} className={`text-primary ${s.anim}`} />
                      {s.task}
                    </span>
                    <span className="text-foreground/60">{s.percentLabel}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="sc-bar h-full rounded-full bg-primary"
                      style={{ "--p": `${s.percent}%` } as CSSProperties}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="sc-layer absolute left-0 top-2 [transform-style:preserve-3d]"
          style={{ "--z": "130px", "--px": "30px" } as CSSProperties}
        >
          <div className="sc-float flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xl shadow-black/20">
            <CheckCircle2 size={16} className="text-green-600" />
            رزرو شما تأیید شد
          </div>
        </div>
      </div>
    </div>
  );
}