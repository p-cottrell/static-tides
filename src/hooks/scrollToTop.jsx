import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollNow = () => {
      const page = document.querySelector(".page-container");
      const route = document.querySelector(".route-wrapper");

      if (page) {
        page.scrollTop = 0;
        page.scrollLeft = 0;
      }
      if (route) {
        route.scrollTop = 0;
        route.scrollLeft = 0;
      }

      window.scrollTo(0, 0);
    };

    scrollNow();
    requestAnimationFrame(() => {
      scrollNow();
      requestAnimationFrame(scrollNow);
    });
  }, [pathname]);

  return null;
}