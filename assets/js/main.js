// main.js — the only entry point. No build step, no dependencies.

import { prefs } from "./core/prefs.js";
import { initReveal } from "./motion/reveal.js";
import { initCounters } from "./motion/counters.js";
import { initScenes } from "./motion/scenes.js";
import { initParallax } from "./motion/parallax.js";
import { initMagnetic } from "./motion/magnetic.js";
import { initNav } from "./sections/nav.js";
import { initHero } from "./sections/hero.js";
import { initJourney } from "./sections/journey.js";
import { initCasebook } from "./sections/casebook.js";
import { initContact } from "./sections/contact.js";

const root = document.documentElement;

function safe(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[portfolio] ${name} failed`, err);
  }
}

// `motion` unlocks every hidden-before-animation state in the CSS. The
// head script already decided this before the first paint so nothing
// flashes; this repeats it for the case where the preference changed in
// another tab between the two.
root.classList.toggle("motion", !prefs.reduce);
root.classList.toggle("reduce", prefs.reduce);

safe("hero", initHero);
safe("reveal", initReveal);
safe("scenes", initScenes);
safe("parallax", initParallax);
safe("magnetic", initMagnetic);
safe("nav", initNav);
safe("journey", initJourney);
safe("casebook", initCasebook);
safe("counters", initCounters);
safe("contact", initContact);

// Tells the head script's fallback timer that the modules arrived.
root.classList.add("is-ready");
