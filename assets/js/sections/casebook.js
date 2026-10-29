// casebook.js — filter the ten engagements and expand a row for detail.

import { $, $$ } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

export function initCasebook() {
  const list = $("[data-entries]");
  if (!list) return;

  const rows = $$(".entry", list);
  const buttons = $$("[data-filter]");
  const label = $("[data-count-label]");

  rows.forEach((row) => {
    const head = row.querySelector(".entry-head");
    if (!head) return;

    const setOpen = (open) => {
      row.dataset.open = String(open);
      head.setAttribute("aria-expanded", String(open));
    };

    setOpen(row.dataset.open === "true");

    head.addEventListener("click", () => {
      setOpen(row.dataset.open !== "true");
    });
  });

  const apply = (filter, animate = false) => {
    let shown = 0;

    rows.forEach((row) => {
      const domains = (row.dataset.domain || "").split(/\s+/);
      const visible = filter === "all" || domains.includes(filter);
      row.classList.toggle("is-hide", !visible);
      row.classList.remove("is-filtered");
      if (visible) shown += 1;
    });

    buttons.forEach((button) => {
      const on = button.dataset.filter === filter;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", String(on));
    });

    if (label) {
      label.textContent = `Showing ${shown} of ${rows.length}`;
    }

    // A person who has just filtered the list gets the rows set back
    // down: one layout read restarts the animation everywhere, then
    // each surviving row is given its place in the stagger.
    if (!animate || prefs.reduce) return;

    void list.offsetHeight;

    let k = 0;
    rows.forEach((row) => {
      if (row.classList.contains("is-hide")) return;
      row.style.setProperty("--k", String(k));
      row.classList.add("is-filtered");
      k += 1;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.filter, true));
  });

  apply("all");
}
