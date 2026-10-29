// hero.js — five lenses on the same person. The visitor picks a lens;
// nothing changes on its own while they are reading.

import { $, $$ } from "../core/dom.js";
import { prefs } from "../core/prefs.js";

const PRESETS = {
  docs: {
    title: "Complex products, made readable.",
    sub: "Writing for software teams since 2017: API references, a 66-page product manual, 250+ knowledge base articles — and the knowledge an AI support agent answers from.",
    evidence: [
      ["250+", "knowledge base articles created"],
      ["66", "pages of hotel booking system manual"],
      ["−40%", "new-starter onboarding time"],
    ],
  },
  ai: {
    title: "AI support, grounded in real docs.",
    sub: "Knowledge bases an agent can actually answer from, prompts that keep a conversation on script, and the documentation that makes automated support accountable.",
    evidence: [
      ["250+", "articles structured for agent retrieval"],
      ["Live", "knowledge base behind an ElevenLabs support agent"],
      ["6", "content domains in a retrieval-ready CRM suite"],
    ],
  },
  editorial: {
    title: "Writing that earns the read.",
    sub: "Articles, case studies, internal learning guides, event decks and proposal edits. Same discipline as the docs: know the audience, cut the fog, land the point.",
    evidence: [
      ["utds.al", "published technical and marketing articles"],
      ["168h", "Qualifi Level 5 TEFL, instructional design"],
      ["Proposals", "edited for client-facing sales teams"],
    ],
  },
  social: {
    title: "Brands that post every day.",
    sub: "Post design and copy for five accounts across B2B digital services and UK trades — built for a phone screen, a two-second scroll and a company that sounds like itself.",
    evidence: [
      ["5", "Instagram accounts designed and written"],
      ["B2B", "agency, CRM and SEO content"],
      ["Trades", "London, Kilmarnock and UK-wide service brands"],
    ],
  },
  ops: {
    title: "The systems behind the work.",
    sub: "SOPs, briefings, meeting notes, release coordination, vendor and inbox management — the operating layer that keeps a small team shipping without dropping anything.",
    evidence: [
      ["19", "workflows turned into an operations manual"],
      ["£4.5M", "UK field-services operation on Bitrix24"],
      ["1:1", "coordination with product, sales and vendors"],
    ],
  },
};

export function initHero() {
  const tabs = $$(".role");
  const title = $("[data-hero-title]");
  const sub = $("[data-hero-sub]");
  const evidence = $("[data-hero-evidence]");
  const panel = $("#hero-panel");
  if (!tabs.length || !title || !sub || !evidence) return;

  let index = tabs.findIndex((tab) => tab.classList.contains("is-on"));
  if (index < 0) index = 0;

  let paintTimer = 0;
  let token = 0;
  let current = tabs[index].dataset.role;

  const render = (key, animate) => {
    const preset = PRESETS[key];
    if (!preset) return;

    token += 1;
    const mine = token;
    clearTimeout(paintTimer);

    const paint = () => {
      title.textContent = preset.title;
      sub.textContent = preset.sub;
      evidence.replaceChildren(
        ...preset.evidence.map(([value, label], i) => {
          const item = document.createElement("li");
          const b = document.createElement("b");
          const span = document.createElement("span");
          b.textContent = value;
          span.textContent = label;
          item.style.setProperty("--i", String(i));
          // Only a person's own switch earns a second animation; the
          // first paint already has the hero's entrance.
          if (animate) item.classList.add("is-fresh");
          item.append(b, span);
          return item;
        })
      );

      tabs.forEach((tab) => {
        const on = tab.dataset.role === key;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
      });

      if (panel) {
        const active = tabs.find((tab) => tab.dataset.role === key);
        if (active && active.id) panel.setAttribute("aria-labelledby", active.id);
      }

      title.classList.remove("is-swapping");
      sub.classList.remove("is-swapping");
      evidence.classList.remove("is-swapping");
    };

    if (!animate || prefs.reduce) {
      paint();
      return;
    }

    title.classList.add("is-swapping");
    sub.classList.add("is-swapping");
    evidence.classList.add("is-swapping");

    paintTimer = window.setTimeout(() => {
      if (mine !== token) return;
      paint();
    }, 160);
  };

  const select = (key, animate = true) => {
    if (!PRESETS[key] || key === current) return;
    current = key;
    render(key, animate);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab.dataset.role, true));

    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      let next = i;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (i + 1) % tabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;

      select(tabs[next].dataset.role, true);
      tabs[next].focus();
    });
  });

  render(current, false);
}
