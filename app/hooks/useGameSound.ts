"use client";

import useSound from "use-sound";
import { useEffect, useState } from "react";

export function useGameSound() {
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playHover] = useSound("/sounds/hover.mp3", {
    volume: 0.5,
    interrupt: true,
    soundEnabled: !isMuted,
  });
  const [playClick] = useSound("/sounds/click.mp3", {
    volume: 0.6,
    soundEnabled: !isMuted,
  });
  const [playTransition] = useSound("/sounds/transition.mp3", {
    volume: 0.5,
    soundEnabled: !isMuted,
  });
  const [playSuccess] = useSound("/sounds/success.mp3", {
    volume: 0.6,
    soundEnabled: !isMuted,
  });
  const [playError] = useSound("/sounds/error.mp3", {
    volume: 0.6,
    soundEnabled: !isMuted,
  });

  const [playBgm, { stop: stopBgm }] = useSound("/sounds/bgm.mp3", {
    volume: 0.3,
    loop: true,
    soundEnabled: !isMuted,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopBgm();
    } else {
      playBgm();
    }
  };

  return {
    playHover: () => {
      console.log("Sound: Hover");
      playHover();
    },
    playClick: () => {
      console.log("Sound: Click");
      playClick();
    },
    playTransition: () => {
      console.log("Sound: Transition");
      playTransition();
    },
    playSuccess: () => {
      console.log("Sound: Success");
      playSuccess();
    },
    playError: () => {
      console.log("Sound: Error");
      playError();
    },
    playBgm,
    stopBgm,
    isMuted,
    toggleMute,
    mounted,
  };
}
