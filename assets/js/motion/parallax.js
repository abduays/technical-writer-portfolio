// parallax.js — the hero plane drifts under the page as it leaves.
// Two transforms, both capped, both dropped on a narrow or low-power
// device where the work is not worth the frames.

import { $ } from "../core/dom.js";
import { onScroll } from "../core/raf.js";
import { prefs } from "../core/prefs.js";

export function initParallax() {
  const body = $(".hero-body");
  const grid = $(".hero-grid");
  if (!body || prefs.reduce || prefs.lowPower || prefs.narrow) return;

  let last = -1;

  onScroll((state) => {
    const y = Math.min(state.y, window.innerHeight * 1.2);
    if (Math.abs(y - last) < 1) return;
    last = y;

    body.style.transform = `translate3d(0, ${(-y * 0.055).toFixed(2)}px, 0)`;
    if (grid) {
      grid.style.transform = `translate3d(0, ${(y * 0.09).toFixed(2)}px, 0)`;
    }
  });
}
