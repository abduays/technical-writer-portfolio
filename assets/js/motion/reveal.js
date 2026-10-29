// reveal.js — one observer, one pass, no text splitting.

import { $$ } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

export function initReveal() {
  const elements = $$("[data-reveal]");
  if (!elements.length) return;

  if (prefs.reduce || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "-6% 0px -10% 0px", threshold: 0.05 }
  );

  elements.forEach((el) => observer.observe(el));
}
