/* eslint-disable prettier/prettier */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LiveProjectButton } from "./LiveProjectButton";

type Project = {
  n: string;
  name: string;
  category: string;
  col1a: string;
  col1b: string;
  col2: string;
};

const PROJECTS: Project[] = [
  {
    n: "01",
    name: "CREWHOLIC STUDIOS",
    category: "CLIENT",
    col1a: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800",
    col1b: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    col2: "https://images.pexels.com/photos/3183176/pexels-photo-3183176.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    n: "02",
    name: "DIGITAL EXPERIENCES",
    category: "PERSONAL",
    col1a: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
    col1b: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=800",
    col2: "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    n: "03",
    name: "MARKET DOMINANCE",
    category: "CLIENT",
    col1a: "https://images.pexels.com/photos/3183154/pexels-photo-3183154.jpeg?auto=compress&cs=tinysrgb&w=800",
    col1b: "https://images.pexels.com/photos/3183162/pexels-photo-3183162.jpeg?auto=compress&cs=tinysrgb&w=800",
    col2: "https://images.pexels.com/photos/3183174/pexels-photo-3183174.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

function Card({
  project,
  index,
  total,
  progress,
  range,
  targetScale,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  targetScale: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <div
      className="sticky top-20 sm:top-24 md:top-32 h-[90vh] sm:h-[85vh] flex items-start justify-center"
      style={{ top: `${Math.min(index * 20 + 80, 120)}px` }}
    >
      <motion.div
        style={{ scale, backgroundColor: "#0C0C0C" }}
        className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] lg:rounded-[60px] border-2 border-[#D7E2EA] p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8"
      >
        {/* Header Section - Improved for mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <span
            className="font-black leading-none text-[#D7E2EA]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 140px)" }}
          >
            {project.n}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-4 flex-1 min-w-0 w-full">
            <span
              className="font-light uppercase tracking-wider sm:tracking-widest text-[#D7E2EA]/70 whitespace-nowrap"
              style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)" }}
            >
              {project.category}
            </span>
            <h3
              className="font-medium uppercase text-[#D7E2EA] leading-tight break-words"
              style={{ fontSize: "clamp(1rem, 3vw, 2.5rem)" }}
            >
              {project.name}
            </h3>
          </div>
          <div className="sm:ml-auto">
            <LiveProjectButton />
          </div>
        </div>

        {/* Images Grid - Responsive gap and rounded corners */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <div className="sm:col-span-2 flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <img
              src={project.col1a}
              alt={`${project.name} image 1`}
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
              style={{ height: "clamp(120px, 16vw, 230px)" }}
              loading="lazy"
            />
            <img
              src={project.col1b}
              alt={`${project.name} image 2`}
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
              style={{ height: "clamp(140px, 22vw, 340px)" }}
              loading="lazy"
            />
          </div>
          <div className="sm:col-span-3">
            <img
              src={project.col2}
              alt={`${project.name} main image`}
              className="w-full h-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
              style={{ minHeight: "clamp(180px, 30vw, 400px)" }}
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const total = PROJECTS.length;
  
  return (
    <section
      id="projects"
      ref={ref}
      className="relative z-10 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 rounded-t-[30px] sm:rounded-t-[40px] md:rounded-t-[50px] lg:rounded-t-[60px] px-3 sm:px-5 md:px-8 lg:px-10 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 sm:pb-24 md:pb-28 lg:pb-32"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <h2
        className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4 break-words"
        style={{ fontSize: "clamp(2.5rem, 10vw, 160px)" }}
      >
        Portfolio
      </h2>
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        {PROJECTS.map((p, i) => {
          const targetScale = 1 - (total - 1 - i) * 0.03;
          const start = i / total;
          const end = (i + 1) / total;
          return (
            <Card
              key={p.n}
              project={p}
              index={i}
              total={total}
              progress={scrollYProgress}
              range={[start, end]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}