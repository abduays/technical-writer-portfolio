// magnetic.js — a control leans a few pixels towards the pointer, then
// springs back when the pointer leaves, and gives under a press. This is
// a pointer affordance only: a touch screen has no hover to read.

import { $$ } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

const PULL = 4.5;
const PRESS = 0.982;

export function initMagnetic() {
  if (prefs.reduce || prefs.lowPower || !prefs.canHover) return;

  const targets = $$(".btn, .nav-cta");

  targets.forEach((el) => {
    el.setAttribute("data-magnetic", "");

    let x = 0;
    let y = 0;
    let down = false;

    const draw = () => {
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      el.style.scale = down ? String(PRESS) : "";
    };

    el.addEventListener("pointerenter", () => {
      el.classList.add("is-tracking");
    });

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      x = Math.max(-1, Math.min(1, nx)) * PULL;
      y = Math.max(-1, Math.min(1, ny)) * PULL;
      draw();
    });

    el.addEventListener("pointerdown", () => {
      down = true;
      draw();
    });

    const release = () => {
      down = false;
      x = 0;
      y = 0;
      draw();
    };

    el.addEventListener("pointerup", release);
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tracking");
      release();
    });
    el.addEventListener("blur", () => {
      el.classList.remove("is-tracking");
      release();
    });
  });
}
