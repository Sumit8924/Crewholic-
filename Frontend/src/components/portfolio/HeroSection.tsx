/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";
import { Magnet } from "./Magnet";
import skr from "./skr.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/service" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const name = userData.name || userData.email?.split("@")[0] || "User";
        setUserName(name);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleDashboardClick = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(user);
      const role = userData?.role;

      if (role === "main_admin") {
        window.location.href = "/admin";
      } else if (role === "rental_admin") {
        window.location.href = "/rental";
      } else if (role === "finance_admin") {
        window.location.href = "/finance";
      } else if (role === "event_admin") {
        window.location.href = "/event";
      } else if (role === "marketing_admin") {
        window.location.href = "/marketing";
      } else if (role === "web_admin") {
        window.location.href = "/webpanel";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      window.location.href = "/dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    window.location.href = href;
  };

  const handleContactClick = () => {
    window.location.href = "/contact";
  };

  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: "clip" }}>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10"
        aria-label="Menu"
      >
        <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
        <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-2xl font-medium uppercase tracking-wider hover:text-[#ff6a00] transition-colors duration-200"
                style={{ color: "#D7E2EA" }}
              >
                {item.label}
              </button>
            ))}

            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-4 mt-4 pt-4 border-t border-white/20 w-full max-w-xs">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-lg font-semibold text-white">{userName}</p>
                </div>

                <button
                  onClick={handleDashboardClick}
                  className="w-full py-2 text-center text-white bg-purple-600/50 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-red-400 border border-red-400/30 rounded-lg hover:bg-red-600/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("/login")}
                className="mt-4 text-2xl font-medium uppercase tracking-wider hover:text-[#ff6a00] transition-colors duration-200"
                style={{ color: "#D7E2EA" }}
              >
                Signup/Login
              </button>
            )}
          </div>
        </div>
      )}

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="hidden md:flex justify-between px-6 md:px-10 pt-6 md:pt-8"
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
              <span className="max-w-[100px] truncate">{userName.split(" ")[0]}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-[#0C0C0C]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm text-gray-300">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                </div>

                <button
                  onClick={handleDashboardClick}
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
        <div className="overflow-hidden mt-16 sm:mt-20 md:mt-8">
          <FadeIn delay={0.15} y={40}>
            <h1
              className="hero-heading font-black uppercase tracking-tight leading-none w-full text-center px-4"
              style={{
                fontSize: "clamp(4rem, 15vw, 12rem)", // Larger on mobile, capped on desktop
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              CREWHOLIC
            </h1>
          </FadeIn>
        </div>

        <FadeIn
          delay={0.6}
          y={30}
          className="absolute left-1/2 -translate-x-1/2 z-10 w-[260px] sm:w-[300px] md:w-[360px] lg:w-[440px] xl:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        >
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <img src={skr} alt="Crewholic logo" className="w-full h-auto" />
          </Magnet>
        </FadeIn>

        <div className="flex justify-between items-end px-4 sm:px-6 md:px-10 pb-5 sm:pb-7 md:pb-10 relative z-20 gap-4">
          <FadeIn delay={0.35} y={20}>
            <p
              className="font-light uppercase tracking-wide leading-snug max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] text-[10px] sm:text-xs md:text-sm lg:text-base"
              style={{ color: "#D7E2EA" }}
            >
              DOMINATE YOUR MARKET DOMINATE YOUR MARKET DIGITAL EXPERIENCES
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <div onClick={handleContactClick}>
              <ContactButton />
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="h-4 sm:h-0" />
    </section>
  );
}