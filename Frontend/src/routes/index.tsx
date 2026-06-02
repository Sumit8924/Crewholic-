/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { HeroSection } from "../components/portfolio/HeroSection";
import { MarqueeSection } from "../components/portfolio/MarqueeSection";
import { AboutSection } from "../components/portfolio/AboutSection";
import { ServicesSection } from "../components/portfolio/ServicesSection";
import { ProjectsSection } from "../components/portfolio/ProjectsSection";

type HomeSearch = {
  welcome?: string;
  name?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      welcome: typeof search.welcome === "string" ? search.welcome : undefined,
      name: typeof search.name === "string" ? search.name : undefined,
    };
  },
  component: Index,
});

function Index() {
  const search = Route.useSearch();

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (search.welcome === "true") {
      setWelcomeMessage(
        search.name
          ? `Welcome to Crewholic, ${search.name}! 🎉`
          : "Welcome to Crewholic! 🎉"
      );

      setShowWelcome(true);

      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [search.welcome, search.name]);

  return (
    <main style={{ backgroundColor: "#0C0C0C", overflowX: "clip" }}>
      {showWelcome && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto z-50 animate-slide-in max-w-sm mx-auto sm:mx-0">
          <div className="bg-gradient-to-r from-[#9B51E0] to-[#F2994A] text-white px-5 py-4 rounded-xl shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>

              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">
                  {welcomeMessage}
                </p>
                <p className="text-xs opacity-90 mt-1">
                  Your journey with Crewholic starts now!
                </p>
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .animate-slide-in {
            animation: slideInUp 0.3s ease-out;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}