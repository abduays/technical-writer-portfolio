// raf.js — one scroll listener, one place where frames are requested.

import { clamp } from "./dom.js";

export const scrollState = {
  y: window.scrollY || 0,
  max: 1,
  progress: 0,
};

const subscribers = new Set();
let queued = false;

function measure() {
  const doc = document.documentElement;
  scrollState.max = Math.max(1, doc.scrollHeight - window.innerHeight);
}

function emit() {
  queued = false;
  scrollState.y = window.scrollY || document.documentElement.scrollTop || 0;
  scrollState.progress = clamp(scrollState.y / scrollState.max, 0, 1);
  subscribers.forEach((fn) => {
    try {
      fn(scrollState);
    } catch (err) {
      console.error("[portfolio] scroll subscriber failed", err);
    }
  });
}

measure();

// Webfonts and images change the page height after the first paint, which
// would leave the progress rule short of the true end of the document.
window.addEventListener("load", measure);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(measure).catch(() => {});
}

window.addEventListener(
  "scroll",
  () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(emit);
  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    measure();
    if (queued) return;
    queued = true;
    requestAnimationFrame(emit);
  },
  { passive: true }
);

/** subscribe to coalesced scroll frames; returns an unsubscribe function */
export function onScroll(fn) {
  subscribers.add(fn);
  fn(scrollState);
  return () => subscribers.delete(fn);
}

/** request frames until fn returns false */
export function rafLoop(fn) {
  let id = 0;
  let stopped = false;

  const step = (time) => {
    id = 0;
    if (stopped) return;
    if (fn(time) !== false) id = requestAnimationFrame(step);
  };

  id = requestAnimationFrame(step);

  return () => {
    stopped = true;
    if (id) cancelAnimationFrame(id);
    id = 0;
  };
}

/** a small tween used by the counters */
export function tween(from, to, duration, onUpdate, onDone) {
  const start = performance.now();

  return rafLoop((now) => {
    const t = clamp((now - start) / duration, 0, 1);
    onUpdate(from + (to - from) * t, t);
    if (t < 1) return true;
    if (onDone) onDone();
    return false;
  });
}
