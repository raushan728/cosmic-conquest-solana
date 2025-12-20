"use client";

import { useEffect, useState } from "react";

export default function SpaceBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen">{children}</div>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black selection:bg-cyan-500/30">
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-black to-black z-0 pointer-events-none" />

      
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse z-0 pointer-events-none" />

      
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] animate-pulse z-0 pointer-events-none" />

  
      <div className="fixed inset-0 z-0 opacity-80 animate-[spin_240s_linear_infinite]">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-1-${i}`}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "1px",
              height: "1px",
            }}
          />
        ))}
      </div>

      
      <div className="fixed inset-0 z-0 opacity-60 animate-[spin_360s_linear_infinite_reverse]">
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-2-${i}`}
            className="absolute bg-cyan-200 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "2px",
              height: "2px",
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
}
