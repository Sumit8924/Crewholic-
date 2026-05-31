/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import logo from "./skr.png"; // Ensure this path is correct based on your project structure

const TOTAL_MS = 5000;

interface SplashScreenProps {
  onDone?: () => void;
  showOncePerSession?: boolean;
}

export function SplashScreen({ onDone, showOncePerSession = true }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (showOncePerSession) {
      const splashShown = sessionStorage.getItem("splashShown");
      if (splashShown) {
        setVisible(false);
        onDone?.();
        return;
      }
      sessionStorage.setItem("splashShown", "true");
    }

    const t1 = setTimeout(() => setFading(true), TOTAL_MS - 500);
    const t2 = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, showOncePerSession]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        .splash-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0C0C0C;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease;
        }

        .splash-fade {
          opacity: 0;
        }

        .splash-scene {
          text-align: center;
          position: relative;
        }

        /* Ribbons */
        .splash-ribbons {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          pointer-events: none;
        }

        .splash-ribbon {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF6B2B, #A855F7, transparent);
          animation: splashRibbonRotate 2s linear infinite;
        }

        .splash-rb1 { transform: rotate(0deg); animation-delay: 0s; }
        .splash-rb2 { transform: rotate(120deg); animation-delay: 0.66s; }
        .splash-rb3 { transform: rotate(240deg); animation-delay: 1.33s; }

        /* Fragments */
        .splash-fragments {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          pointer-events: none;
        }

        .splash-frag {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #FF6B2B;
          animation: splashFragFly 1.5s ease-out infinite;
        }

        .splash-f1 { top: 0; left: 50%; animation-delay: 0s; }
        .splash-f2 { bottom: 0; left: 50%; animation-delay: 0.3s; }
        .splash-f3 { left: 0; top: 50%; animation-delay: 0.6s; }
        .splash-f4 { right: 0; top: 50%; animation-delay: 0.9s; }

        /* Logo */
        .splash-logo-wrap {
          animation: splashLogoPop 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }

        .splash-logo-img {
          width: 120px;
          height: auto;
          animation: splashLogoGlow 2s ease-in-out infinite;
        }

        /* Brand */
        .splash-brand {
          margin-top: 24px;
          opacity: 0;
          animation: splashBrandFade 0.6s ease forwards 0.3s;
        }

        .splash-brand-name {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 8px;
          background: linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-family: 'Kanit', sans-serif;
        }

        .splash-brand-tagline {
          font-size: 10px;
          letter-spacing: 4px;
          color: rgba(255,107,43,0.7);
          margin-top: 8px;
          font-family: monospace;
        }

        .splash-brand-tagline span {
          color: rgba(255,255,255,0.3);
        }

        /* Animations */
        @keyframes splashRibbonRotate {
          0% {
            transform: rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.3;
          }
        }

        @keyframes splashFragFly {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        @keyframes splashLogoPop {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes splashLogoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(255,107,43,0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255,107,43,0.6));
          }
        }

        @keyframes splashBrandFade {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className={`splash-root ${fading ? "splash-fade" : ""}`}>
        <div className="splash-scene">
          {/* Rotating Ribbons */}
          <div className="splash-ribbons">
            <div className="splash-ribbon splash-rb1" />
            <div className="splash-ribbon splash-rb2" />
            <div className="splash-ribbon splash-rb3" />
          </div>

          {/* Flying Fragments */}
          <div className="splash-fragments">
            <div className="splash-frag splash-f1" />
            <div className="splash-frag splash-f2" />
            <div className="splash-frag splash-f3" />
            <div className="splash-frag splash-f4" />
          </div>

          {/* Logo */}
          <div className="splash-logo-wrap">
            <img src={logo} alt="Crewholic" className="splash-logo-img" />
          </div>

          {/* Brand Text */}
          <div className="splash-brand">
            <div className="splash-brand-name">
              CREWHOLIC
            </div>
            <div className="splash-brand-tagline">
              CREATIVE <span>•</span> DIGITAL <span>•</span> EVENTS
            </div>
          </div>
        </div>
      </div>
    </>
  );
}