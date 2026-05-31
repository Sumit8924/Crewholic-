import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/portfolio/HeroSection";
import { MarqueeSection } from "../components/portfolio/MarqueeSection";
import { AboutSection } from "../components/portfolio/AboutSection";
import { ServicesSection } from "../components/portfolio/ServicesSection";
import { ProjectsSection } from "../components/portfolio/ProjectsSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main style={{ backgroundColor: "#0C0C0C", overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
