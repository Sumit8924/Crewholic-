/* eslint-disable prettier/prettier */
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type FadeInProps = {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
} & Omit<HTMLMotionProps<"div">, "children">;

export function FadeIn({
  as,
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  ...rest
}: FadeInProps) {
  const Comp = motion.create((as ?? "div") as ElementType);
  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}