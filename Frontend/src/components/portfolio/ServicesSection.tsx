/* eslint-disable prettier/prettier */
import { FadeIn } from "./FadeIn";

const SERVICES = [
  {
    n: "01",
    name: "Web Development",
    desc: "Custom websites, e-commerce solutions, and web applications built with modern technologies for optimal performance.",
  },
  {
    n: "02",
    name: "Digital Marketing",
    desc: "Strategic digital marketing solutions to boost your online presence, drive engagement, and maximize ROI.",
  },
  {
    n: "03",
    name: "Event Management",
    desc: "End-to-end event planning and execution for corporate events, conferences, weddings, and special occasions.",
  },
  {
    n: "04",
    name: "Rental Equipment",
    desc: "Professional audio, video, and photography equipment rental for events, productions, and creative projects.",
  },
  {
    n: "05",
    name: "Content Creation",
    desc: " High-quality content creation including video production, photography, motion graphics, copywriting, and social media content that tells your brand's story.",
  },
];

export function ServicesSection() {
  return (
    <section
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Services
      </h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn
            key={s.n}
            delay={i * 0.1}
            className="flex items-start gap-6 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
            style={{
              borderTop: i === 0 ? "1px solid rgba(12,12,12,0.15)" : undefined,
              borderBottom: "1px solid rgba(12,12,12,0.15)",
            }}
          >
            <span
              className="font-black shrink-0 leading-none"
              style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {s.n}
            </span>
            <div className="flex flex-col gap-3 sm:gap-4 flex-1">
              <h3
                className="font-medium uppercase"
                style={{ color: "#0C0C0C", fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {s.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl"
                style={{
                  color: "#0C0C0C",
                  opacity: 0.6,
                  fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                }}
              >
                {s.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}