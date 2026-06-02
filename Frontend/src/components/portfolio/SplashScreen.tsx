/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import logo from "./skr.png";

type SplashScreenProps = {
  onDone?: () => void;
  showOncePerSession?: boolean;
};

export default function SplashScreen({
  onDone,
  showOncePerSession = true,
}: SplashScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (showOncePerSession && sessionStorage.getItem("splashShown") === "true") {
      handleComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 4800);

    return () => clearTimeout(timer);
  }, [showOncePerSession]);

  const handleComplete = () => {
    if (showOncePerSession) {
      sessionStorage.setItem("splashShown", "true");
    }

    if (onDone) {
      onDone();
    }

    navigate({ to: "/" });
  };

  return (
    <main className="splash-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          min-height: 100%;
          background: #0a0a0a;
        }

        .splash-screen {
          width: 100vw;
          height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          overflow: hidden;
          position: fixed;
          inset: 0;
          z-index: 999999;
        }

        .scene {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 100%;
          max-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .ribbons {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -58%);
          width: 320px;
          height: 220px;
        }

        .ribbon {
          position: absolute;
          border-radius: 60px;
          opacity: 0;
        }

        .rb1 {
          width: 240px;
          height: 34px;
          background: linear-gradient(90deg, #ff5ca8, #cc40ff, #7733ff);
          top: 18px;
          left: 0;
          transform: translateX(-340px) rotate(-7deg);
          animation: rb1slide 0.55s cubic-bezier(.2,.8,.4,1) 0.1s forwards,
                     rbExit 0.30s ease-in 1.4s forwards;
          box-shadow: 0 6px 24px rgba(180, 60, 255, 0.5);
        }

        .rb2 {
          width: 260px;
          height: 36px;
          background: linear-gradient(90deg, #ff6000, #ffbb00, #ffe000);
          top: 88px;
          left: -10px;
          transform: translateX(400px) rotate(-4deg);
          animation: rb2slide 0.55s cubic-bezier(.2,.8,.4,1) 0.28s forwards,
                     rbExit 0.30s ease-in 1.4s forwards;
          box-shadow: 0 6px 24px rgba(255, 150, 0, 0.5);
        }

        .rb3 {
          width: 230px;
          height: 30px;
          background: linear-gradient(90deg, #ff2244, #ff5500, #ff9900);
          top: 160px;
          left: 20px;
          transform: translateX(-340px) rotate(-5deg);
          animation: rb3slide 0.55s cubic-bezier(.2,.8,.4,1) 0.46s forwards,
                     rbExit 0.30s ease-in 1.4s forwards;
          box-shadow: 0 6px 24px rgba(255, 60, 0, 0.4);
        }

        @keyframes rb1slide {
          to {
            opacity: 1;
            transform: translateX(0) rotate(-7deg);
          }
        }

        @keyframes rb2slide {
          to {
            opacity: 1;
            transform: translateX(0) rotate(-4deg);
          }
        }

        @keyframes rb3slide {
          to {
            opacity: 1;
            transform: translateX(0) rotate(-5deg);
          }
        }

        @keyframes rbExit {
          to {
            opacity: 0;
            transform: scaleX(0.15) rotate(0deg);
          }
        }

        .fragments {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -58%);
          width: 200px;
          height: 180px;
          opacity: 0;
          animation: fragsIn 0.01s 1.4s forwards,
                     fragsOut 0.35s ease-in 2.1s forwards;
        }

        @keyframes fragsIn {
          to {
            opacity: 1;
          }
        }

        @keyframes fragsOut {
          to {
            opacity: 0;
            transform: translate(-50%, -58%) scale(0.3);
          }
        }

        .frag {
          position: absolute;
          border-radius: 6px;
          opacity: 0;
        }

        .f1 {
          width: 38px;
          height: 55px;
          background: linear-gradient(160deg, #ee44cc, #9922bb);
          left: 35px;
          top: 10px;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.5), inset -3px -3px 8px rgba(0,0,0,0.3);
          border-radius: 8px 8px 4px 4px;
          animation: fragBounce 0.4s ease 1.42s forwards;
        }

        .f2 {
          width: 42px;
          height: 52px;
          background: linear-gradient(160deg, #ff9900, #ff5500);
          left: 110px;
          top: 8px;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.5), inset -3px -3px 8px rgba(0,0,0,0.3);
          border-radius: 8px 8px 4px 4px;
          animation: fragBounce 0.4s ease 1.5s forwards;
        }

        .f3 {
          width: 38px;
          height: 50px;
          background: linear-gradient(160deg, #ff5500, #cc2200);
          left: 38px;
          top: 95px;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.5), inset -3px -3px 8px rgba(0,0,0,0.3);
          border-radius: 4px 4px 8px 8px;
          animation: fragBounce 0.4s ease 1.48s forwards;
        }

        .f4 {
          width: 42px;
          height: 48px;
          background: linear-gradient(160deg, #ffaa00, #ff6600);
          left: 112px;
          top: 98px;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.5), inset -3px -3px 8px rgba(0,0,0,0.3);
          border-radius: 4px 4px 8px 8px;
          animation: fragBounce 0.4s ease 1.56s forwards;
        }

        @keyframes fragBounce {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.7);
          }

          60% {
            opacity: 1;
            transform: translateY(6px) scale(1.05);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .logo-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -58%);
          opacity: 0;
          animation: logoIn 0.7s cubic-bezier(.2,.8,.3,1.2) 2.2s forwards;
        }

        @keyframes logoIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -58%) scale(0.55);
            filter: brightness(2) saturate(0.3);
          }

          60% {
            opacity: 1;
            transform: translate(-50%, -58%) scale(1.04);
            filter: brightness(1.3) saturate(0.8);
          }

          100% {
            opacity: 1;
            transform: translate(-50%, -58%) scale(1);
            filter: brightness(1) saturate(1);
          }
        }

        .logo-img {
          width: 300px;
          height: 300px;
          object-fit: contain;
          filter:
            drop-shadow(0 8px 40px rgba(255,80,180,0.4))
            drop-shadow(0 0 60px rgba(255,160,0,0.25));
        }

        .brand {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          opacity: 0;
          animation: brandIn 0.1s ease 3.0s forwards;
          width: 90%;
        }

        @keyframes brandIn {
          to {
            opacity: 1;
          }
        }

        .brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          letter-spacing: 11px;
          color: #f0ece0;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .brand-name::before {
          content: 'CREWHOLIC';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          color: #f0ece0;
          clip-path: inset(0 100% 0 0);
          animation: textWipe 0.6s steps(12,end) 3.05s forwards;
        }

        .brand-name .ghost {
          opacity: 0;
        }

        @keyframes textWipe {
          0% {
            clip-path: inset(0 100% 0 0);
          }

          100% {
            clip-path: inset(0 0% 0 0);
          }
        }

        .brand-name::after {
          content: 'CREWHOLIC';
          position: absolute;
          left: 3px;
          top: 0;
          width: 100%;
          height: 100%;
          color: #ff5ca8;
          clip-path: inset(0 100% 0 0);
          opacity: 0.5;
          animation: glitchBar 0.6s steps(12,end) 3.05s forwards,
                     glitchFade 0.3s ease 3.65s forwards;
        }

        @keyframes glitchBar {
          0% {
            clip-path: inset(0 100% 0 0);
          }

          100% {
            clip-path: inset(0 0% 0 0);
          }
        }

        @keyframes glitchFade {
          to {
            opacity: 0;
            left: 0;
          }
        }

        .brand-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #777;
          text-transform: uppercase;
          margin-top: 10px;
          opacity: 0;
          animation: fadeUp 0.6s ease 3.75s forwards;
          white-space: nowrap;
        }

        .brand-tagline span {
          color: #ff6a00;
          margin: 0 5px;
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .scene {
            max-height: 500px;
            padding: 15px;
          }

          .logo-img {
            width: 220px;
            height: 220px;
          }

          .brand {
            bottom: 80px;
          }

          .brand-name {
            font-size: 38px;
            letter-spacing: 5px;
          }

          .brand-tagline {
            font-size: 8px;
            letter-spacing: 2px;
            white-space: normal;
            word-break: keep-all;
            max-width: 280px;
            margin: 8px auto 0;
            line-height: 1.4;
          }

          .ribbons {
            transform: translate(-50%, -58%) scale(0.7);
          }

          .fragments {
            transform: translate(-50%, -58%) scale(0.7);
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .scene {
            max-height: 450px;
            padding: 10px;
          }

          .logo-img {
            width: 180px;
            height: 180px;
          }

          .brand {
            bottom: 70px;
          }

          .brand-name {
            font-size: 28px;
            letter-spacing: 3px;
          }

          .brand-tagline {
            font-size: 7px;
            letter-spacing: 1.5px;
            max-width: 240px;
          }

          .ribbons {
            transform: translate(-50%, -58%) scale(0.55);
          }

          .fragments {
            transform: translate(-50%, -58%) scale(0.55);
          }

          .rb1, .rb2, .rb3 {
            transform-origin: center;
          }
        }

        /* Landscape Mode on Mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .scene {
            max-height: 400px;
          }

          .logo-img {
            width: 150px;
            height: 150px;
          }

          .brand {
            bottom: 30px;
          }

          .brand-name {
            font-size: 28px;
            letter-spacing: 4px;
          }

          .brand-tagline {
            font-size: 7px;
            letter-spacing: 2px;
          }

          .ribbons {
            transform: translate(-50%, -58%) scale(0.5);
          }

          .fragments {
            transform: translate(-50%, -58%) scale(0.5);
          }
        }

        /* Extra Small Devices */
        @media (max-width: 360px) {
          .brand-name {
            font-size: 24px;
            letter-spacing: 2px;
          }

          .brand-tagline {
            font-size: 6px;
            letter-spacing: 1px;
            max-width: 200px;
          }

          .logo-img {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>

      <div className="scene">
        <div className="ribbons">
          <div className="ribbon rb1" />
          <div className="ribbon rb2" />
          <div className="ribbon rb3" />
        </div>

        <div className="fragments">
          <div className="frag f1" />
          <div className="frag f2" />
          <div className="frag f3" />
          <div className="frag f4" />
        </div>

        <div className="logo-wrap">
          <img className="logo-img" src={logo} alt="Crewholic" />
        </div>

        <div className="brand">
          <div className="brand-name">
            <span className="ghost">CREWHOLIC</span>
          </div>

          <div className="brand-tagline">
            MEDIA <span>·</span> MARKETING <span>·</span> EVENTS <span>·</span> WEB
          </div>
        </div>
      </div>
    </main>
  );
}