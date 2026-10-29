// journey.js — the rail fills as the story is read, and the entry you
// are reading is marked.

import { $, $$, clamp } from "../core/dom.js";
import { onScroll } from "../core/raf.js";

export function initJourney() {
  const wrap = $("[data-journey]");
  if (!wrap) return;

  const fill = $("[data-journey-fill]");
  const fillEl = fill || $(".journey-fill");
  const steps = $$(".step", wrap);

  onScroll(() => {
    const rect = wrap.getBoundingClientRect();
    const line = window.innerHeight * 0.55;
    const passed = clamp(line - rect.top, 0, rect.height);
    const percent = rect.height ? (passed / rect.height) * 100 : 0;

    if (fillEl) fillEl.style.setProperty("--j", `${percent.toFixed(2)}%`);

    const focusLine = window.innerHeight * 0.4;
    let near = -1;

    steps.forEach((step, index) => {
      if (step.getBoundingClientRect().top <= focusLine) near = index;
    });

    steps.forEach((step, index) =>
      step.classList.toggle("is-near", index === near)
    );
  });
}
