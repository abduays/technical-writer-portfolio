// counters.js — plain numbers, with an optional prefix, suffix, decimal
// places and a start delay so a number can land with the rest of a
// sequence instead of racing it.

import { $$, clamp, onVisible, easeOutCubic } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

const DURATION = 1300;

function paint(el, value) {
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const places = Number.parseInt(el.dataset.decimals || "0", 10) || 0;
  const text = places > 0 ? value.toFixed(places) : String(Math.round(value));
  el.textContent = `${prefix}${text}${suffix}`;
}

function run(el) {
  const target = parseFloat(el.dataset.count);
  if (!Number.isFinite(target)) return;

  if (prefs.reduce) {
    paint(el, target);
    return;
  }

  const delay = Number.parseInt(el.dataset.delay || "0", 10) || 0;
  const start = performance.now() + delay;

  const step = (now) => {
    const t = clamp((now - start) / DURATION, 0, 1);
    paint(el, target * easeOutCubic(t));

    if (t < 1) {
      requestAnimationFrame(step);
      return;
    }

    paint(el, target);
    el.classList.add("is-landed");
    el.addEventListener("animationend", () => el.classList.remove("is-landed"), {
      once: true,
    });
  };

  requestAnimationFrame(step);
}

export function initCounters() {
  const numbers = $$("[data-count]");
  if (!numbers.length) return;
  onVisible(numbers, (el) => run(el));
}
