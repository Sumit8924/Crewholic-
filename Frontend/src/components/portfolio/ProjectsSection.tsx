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
    name: "Nextlevel Studio",
    category: "Client",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    n: "02",
    name: "Aura Brand Identity",
    category: "Personal",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    n: "03",
    name: "Solaris Digital",
    category: "Client",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
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
      className="sticky top-24 md:top-32 h-[85vh] flex items-start justify-center"
      style={{ top: `${index * 28 + 96}px` }}
    >
      <motion.div
        style={{ scale, backgroundColor: "#0C0C0C" }}
        className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8"
      >
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
          <span
            className="font-black leading-none text-[#D7E2EA]"
            style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
          >
            {project.n}
          </span>
          <div className="flex flex-col flex-1 min-w-0">
            <span
              className="font-light uppercase tracking-widest text-[#D7E2EA]/70"
              style={{ fontSize: "clamp(0.75rem, 1.2vw, 1rem)" }}
            >
              {project.category}
            </span>
            <h3
              className="font-medium uppercase text-[#D7E2EA] leading-tight"
              style={{ fontSize: "clamp(1.25rem, 3vw, 2.5rem)" }}
            >
              {project.name}
            </h3>
          </div>
          <LiveProjectButton />
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          <div className="col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-6">
            <img
              src={project.col1a}
              alt=""
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
              loading="lazy"
            />
            <img
              src={project.col1b}
              alt=""
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
              loading="lazy"
            />
          </div>
          <div className="col-span-3">
            <img
              src={project.col2}
              alt=""
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
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
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <h2
        className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-24"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Portfolio
      </h2>
      <div className="max-w-6xl mx-auto">
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