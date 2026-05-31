import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Char({
  ch,
  range,
  progress,
}: {
  ch: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden" }}>{ch === " " ? "\u00A0" : ch}</span>
      <motion.span
        style={{
          opacity,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    </span>
  );
}

export function AnimatedText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = Array.from(text);
  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((ch, i) => {
        const start = i / chars.length;
        const end = (i + 1) / chars.length;
        return <Char key={i} ch={ch} range={[start, end]} progress={scrollYProgress} />;
      })}
    </p>
  );
}