import { useEffect } from "react";
import { useMessageMenu } from "../context/MessageMenuContext";

export function usePrecentScroll(selector) {
  const { state } = useMessageMenu();
  useEffect(() => {
    const container = document.querySelector(selector);
    if (!container) return;

    function handleScroll(e) {
      if (state.isOpen) {
        e.preventDefault();
        container.scrollTop = scrollPosition;
      }
    }

    let scrollPosition = container.scrollTop;

    if (state.isOpen) {
      container.addEventListener("wheel", handleScroll);
      container.addEventListener("touchmove", handleScroll);
    }

    return () => {
      container.removeEventListener("wheel", handleScroll);
      container.removeEventListener("touchmove", handleScroll);
    };
  }, [state.isOpen, selector]);
}
