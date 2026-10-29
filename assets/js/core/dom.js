// dom.js — the handful of helpers the rest of the site uses.

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const lerp = (a, b, t) => a + (b - a) * t;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export { easeOutCubic };

/** run a callback when the element first becomes visible */
export function onVisible(elements, callback, options = {}) {
  const list = Array.isArray(elements) ? elements : [elements];
  if (!list.length) return () => {};

  if (!("IntersectionObserver" in window)) {
    list.forEach((el) => callback(el));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        callback(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05, ...options }
  );

  list.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

export function debounce(fn, wait = 150) {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
