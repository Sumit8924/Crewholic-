/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState, useCallback } from "react";

const IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW1 = IMAGES.slice(0, 11);
const ROW2 = IMAGES.slice(11);

// ─── TILE ─────────────────────────────────────────────────────────────────
function Tile({ src }: { src: string }) {
  return (
    <img
      src={src}
      loading="lazy"
      alt=""
      draggable={false}
      className="rounded-2xl object-cover shrink-0 select-none pointer-events-none"
      style={{ width: 420, height: 270 }}
    />
  );
}

// ─── DRAGGABLE ROW ────────────────────────────────────────────────────────
function DraggableRow({
  images,
  baseOffset,
  direction = 1,
  rowId,
}: {
  images: string[];
  baseOffset: number;
  direction?: 1 | -1;
  rowId: string;
}) {
  // drag state
  const isDragging   = useRef(false);
  const startX       = useRef(0);
  const dragOffset   = useRef(0);
  const lastDragX    = useRef(0);
  const velocity     = useRef(0);
  const rafId        = useRef<number>(0);
  const momentumRef  = useRef(0);

  const [manualOffset, setManualOffset] = useState(0);
  const [cursor, setCursor]             = useState<"grab" | "grabbing">("grab");

  // ── momentum decay ─────────────────────────────────────────────────────
  const runMomentum = useCallback(() => {
    velocity.current *= 0.93;           // friction
    if (Math.abs(velocity.current) < 0.3) {
      velocity.current = 0;
      return;
    }
    momentumRef.current += velocity.current;
    setManualOffset(momentumRef.current);
    rafId.current = requestAnimationFrame(runMomentum);
  }, []);

  // ── pointer events ─────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    cancelAnimationFrame(rafId.current);
    isDragging.current  = true;
    startX.current      = e.clientX;
    dragOffset.current  = momentumRef.current;
    lastDragX.current   = e.clientX;
    velocity.current    = 0;
    setCursor("grabbing");
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx      = e.clientX - startX.current;
    const newVal  = dragOffset.current + dx;
    velocity.current  = e.clientX - lastDragX.current;
    lastDragX.current = e.clientX;
    momentumRef.current = newVal;
    setManualOffset(newVal);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setCursor("grab");
    rafId.current = requestAnimationFrame(runMomentum);
  }, [runMomentum]);

  // ── touch events ───────────────────────────────────────────────────────
  const touchStartX = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    cancelAnimationFrame(rafId.current);
    touchStartX.current = e.touches[0].clientX;
    dragOffset.current  = momentumRef.current;
    lastDragX.current   = e.touches[0].clientX;
    velocity.current    = 0;
    isDragging.current  = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx     = e.touches[0].clientX - touchStartX.current;
    const newVal = dragOffset.current + dx;
    velocity.current    = e.touches[0].clientX - lastDragX.current;
    lastDragX.current   = e.touches[0].clientX;
    momentumRef.current = newVal;
    setManualOffset(newVal);
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    rafId.current = requestAnimationFrame(runMomentum);
  }, [runMomentum]);

  // ── cleanup ────────────────────────────────────────────────────────────
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  // ── combine scroll + drag offsets ──────────────────────────────────────
  // direction: row1 goes +baseOffset, row2 goes -baseOffset
  const totalTx = direction * baseOffset + manualOffset;

  const repeated = [...images, ...images, ...images];

  return (
    <div
      id={rowId}
      className="flex gap-3"
      style={{
        transform:  `translateX(${totalTx}px)`,
        willChange: "transform",
        cursor,
        userSelect: "none",
        touchAction: "pan-y",          // allow vertical scroll, intercept horizontal
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {repeated.map((src, i) => (
        <Tile key={`${rowId}-${i}`} src={src} />
      ))}
    </div>
  );
}

// ─── MARQUEE SECTION ──────────────────────────────────────────────────────
export function MarqueeSection() {
  const ref            = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const val = (window.scrollY - top + window.innerHeight) * 0.3;
      setScrollOffset(val);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const baseOffset = scrollOffset - 200;

  return (
    <section
      ref={ref}
      className="overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <div className="flex flex-col gap-3">
        {/* Row 1 — moves right on scroll, user can drag */}
        <DraggableRow
          rowId="row1"
          images={ROW1}
          baseOffset={baseOffset}
          direction={1}
        />

        {/* Row 2 — moves left on scroll, user can drag */}
        <DraggableRow
          rowId="row2"
          images={ROW2}
          baseOffset={baseOffset}
          direction={-1}
        />
      </div>
    </section>
  );
}