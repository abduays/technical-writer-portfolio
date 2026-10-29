// nav.js — progress rule, current section, mobile menu.

import { $, $$ } from "../core/dom.js";
import { onScroll } from "../core/raf.js";

export function initNav() {
  const nav = $("[data-nav]");
  if (!nav) return;

  const links = $$("[data-spy]");
  const progress = $("[data-progress]");
  const marker = $("[data-nav-line]");
  const burger = $("[data-burger]");
  const menu = $("[data-menu]");

  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      const el = id && id.length > 1 ? document.querySelector(id) : null;
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  const contact = document.querySelector("#contact");

  let active = "";

  // The current section is marked by one rule that travels between the
  // links rather than a border that blinks on and off.
  const mark = (link) => {
    if (!marker) return;
    if (!link) {
      marker.style.opacity = "0";
      return;
    }
    marker.style.opacity = "1";
    marker.style.width = `${link.offsetWidth}px`;
    marker.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  onScroll((state) => {
    if (progress) progress.style.transform = `scaleX(${state.progress})`;

    const line = state.y + window.innerHeight * 0.34;
    // Nothing is marked current in the hero or once the closing section
    // is on screen — neither of them is a nav entry.
    let current =
      line >= sections[0].el.offsetTop && !(contact && line >= contact.offsetTop)
        ? sections[0]
        : null;

    sections.forEach((entry) => {
      if (contact && line >= contact.offsetTop) return;
      if (entry.el.offsetTop <= line) current = entry;
    });

    const link = current ? current.link : null;
    const href = link ? link.getAttribute("href") : "";
    if (href === active) return;
    active = href;

    links.forEach((item) => item.classList.toggle("is-active", item === link));
    mark(link);
  });

  // Offsets move with the viewport, so the rule is re-measured rather
  // than trusted from the last frame.
  window.addEventListener(
    "resize",
    () => mark(links.find((link) => link.classList.contains("is-active")) || null),
    { passive: true }
  );

  const setMenu = (open) => {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
  };

  if (burger && menu) {
    burger.addEventListener("click", () => {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) setMenu(false);
    });
  }
}
