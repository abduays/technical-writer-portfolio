// contact.js — copy the address, confirm it, then go back to normal.

import { $ } from "../core/dom.js";

async function copy(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      /* fall through to the legacy path */
    }
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (err) {
    ok = false;
  }

  field.remove();
  return ok;
}

export function initContact() {
  const button = $("[data-copy]");
  if (!button) return;

  const label = $("[data-copy-label]", button);
  if (!label) return;

  const original = label.textContent;
  label.setAttribute("aria-live", "polite");

  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    if (!value) return;

    const ok = await copy(value);

    label.textContent = ok ? "Copied to clipboard" : value;
    button.classList.toggle("is-copied", ok);

    clearTimeout(button._reset);
    button._reset = setTimeout(() => {
      label.textContent = original;
      button.classList.remove("is-copied");
    }, 1900);
  });
}
