/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", move);

    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (t) {
        setHover(true);
        setLabel(t.dataset.cursor || "");
      } else {
        setHover(false);
        setLabel("");
      }
    };
    window.addEventListener("mouseover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="fixed left-0 top-0 z-[100] pointer-events-none hidden md:flex items-center justify-center rounded-full bg-white text-black font-display text-[11px] uppercase tracking-widest"
      animate={{
        width: hover ? 120 : 12,
        height: hover ? 120 : 12,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.6 }}
    >
      <span className="opacity-100">{label}</span>
    </motion.div>
  );
}