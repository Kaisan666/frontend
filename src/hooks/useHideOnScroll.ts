import { useEffect, useRef, useState } from "react";

const MIN_SCROLL = 80;
const DELTA = 5;

export function useHideOnScroll(): boolean {
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;

      if (currentY < MIN_SCROLL) {
        setIsHidden(false);
        lastY.current = currentY;
        ticking.current = false;
        return;
      }

      if (Math.abs(currentY - lastY.current) < DELTA) {
        ticking.current = false;
        return;
      }

      setIsHidden(currentY > lastY.current);
      lastY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return isHidden;
}
