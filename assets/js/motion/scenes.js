// scenes.js — an ambient loop only runs while its scene is on screen.
// The AI pipeline is the one looping graphic on the page; it should not
// keep a phone awake while someone reads the casebook.

import { $$ } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

export function initScenes() {
  const scenes = $$("[data-scene]");
  if (!scenes.length) return;

  // Without a viewer there is nothing to pause for, and without an
  // observer the loop simply runs (the CSS still honours the preference).
  if (prefs.reduce || !("IntersectionObserver" in window)) {
    scenes.forEach((el) => el.classList.add("is-live"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-live", entry.isIntersecting);
      });
    },
    { rootMargin: "18% 0px" }
  );

  scenes.forEach((el) => observer.observe(el));
}
