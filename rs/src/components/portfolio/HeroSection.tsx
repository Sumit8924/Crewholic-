/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";
import { Magnet } from "./Magnet";
import skr from "./skr.png";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "/services" },  // Changed to link to services page
  { label: "Price", href: "#price" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const name = userData.name || userData.email?.split('@')[0] || "User";
        setUserName(name);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: "clip" }}>
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
            style={{ color: "#D7E2EA" }}
          >
            {item.label}
          </a>
        ))}

        {isLoggedIn ? (
          <div className="relative group">
            <button
              className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200 flex items-center gap-2"
              style={{ color: "#D7E2EA" }}
            >
              <span>👋</span>
              {userName.split(' ')[0]}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-[#0C0C0C]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm text-gray-300">Signed in as</p>
                  <p className="text-sm font-semibold text-white">{userName}</p>
                </div>
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <a
            href="/login"
            className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
            style={{ color: "#D7E2EA" }}
          >
            Signup/Login
          </a>
        )}
      </FadeIn>

      <div className="flex-1 flex flex-col justify-between relative">
        <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
              CREWHOLIC
            </h1>
          </FadeIn>
        </div>

        <FadeIn
          delay={0.6}
          y={30}
          className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
          <img
            src={skr}
            alt="Creholic logo"
            className="w-full h-auto"
          />
          </Magnet>
        </FadeIn>

        <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
          <FadeIn delay={0.35} y={20}>
            <p
              className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
              style={{ color: "#D7E2EA", fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
            >
              DOMINATE YOUR MARKET DOMINATE YOUR MARKET DIGITAL EXPERIENCES
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}