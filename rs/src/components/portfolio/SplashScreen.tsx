import { useEffect, useState } from "react";
import logo from "@/assets/creholic-logo.png";

const TOTAL_MS = 5000;

export function SplashScreen({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), TOTAL_MS - 500);
    const t2 = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className={`splash-root ${fading ? "splash-fade" : ""}`}>
      <div className="splash-scene">
        <div className="splash-ribbons">
          <div className="splash-ribbon splash-rb1" />
          <div className="splash-ribbon splash-rb2" />
          <div className="splash-ribbon splash-rb3" />
        </div>

        <div className="splash-fragments">
          <div className="splash-frag splash-f1" />
          <div className="splash-frag splash-f2" />
          <div className="splash-frag splash-f3" />
          <div className="splash-frag splash-f4" />
        </div>

        <div className="splash-logo-wrap">
          <img src={logo} alt="Creholic" className="splash-logo-img" />
        </div>

        <div className="splash-brand">
          <div className="splash-brand-name">
            <span className="splash-ghost">CREWHOLIC</span>
          </div>
          <div className="splash-brand-tagline">
            CREATIVE <span>•</span> DIGITAL <span>•</span> EVENTS
          </div>
        </div>
      </div>
    </div>
  );
}
