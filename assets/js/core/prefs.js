// prefs.js — every module asks this before it animates anything.

const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

const listeners = new Set();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(prefs);
    } catch (err) {
      console.error("[portfolio] preference listener failed", err);
    }
  });
}

if (typeof reduceQuery.addEventListener === "function") {
  reduceQuery.addEventListener("change", notify);
  hoverQuery.addEventListener("change", notify);
}

// `?motion=off` is a documented override so the reduced experience can be
// reviewed on a machine that has no OS setting for it.
const params = new URLSearchParams(window.location.search);
const forcedOff = params.get("motion") === "off";

export const prefs = {
  get reduce() {
    return forcedOff || reduceQuery.matches;
  },

  /** true only for a real pointer, never a touch screen */
  get canHover() {
    return hoverQuery.matches;
  },

  /** a conservative guess; only used to shed optional effects */
  get lowPower() {
    const cores = navigator.hardwareConcurrency || 8;
    const memory = navigator.deviceMemory || 8;
    const saveData = !!(navigator.connection && navigator.connection.saveData);
    return cores <= 4 || memory <= 4 || saveData;
  },

  get narrow() {
    return window.innerWidth <= 980;
  },
};

/** subscribe to preference changes; returns an unsubscribe function */
export function onPrefChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
