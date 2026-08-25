/**
 * Hacker-style decode animation for GHOST EDITION branding.
 * Resolves each glyph from noise into the final string.
 */

const GLYPHS = '01<>/\\|#@$%*+=!?ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrambleFrame(finalText, lockedCount, seed) {
  let out = '';
  for (let i = 0; i < finalText.length; i += 1) {
    const ch = finalText[i];
    if (ch === ' ') {
      out += ' ';
      continue;
    }
    if (i < lockedCount) {
      out += ch;
      continue;
    }
    const idx = (seed + i * 17 + lockedCount * 31) % GLYPHS.length;
    out += GLYPHS[idx];
  }
  return out;
}

function revealElement(el) {
  const finalText = String(el.getAttribute('data-hacker-text') || el.textContent || '').trim();
  if (!finalText) return;

  el.setAttribute('data-hacker-final', finalText);
  if (prefersReducedMotion()) {
    el.textContent = finalText;
    el.classList.add('ghost-edition-ready');
    return;
  }

  const duration = 1100;
  const started = performance.now();
  let frame = 0;

  const tick = (now) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = 1 - (1 - t) ** 3;
    const locked = Math.floor(eased * (finalText.length + 1));
    el.textContent = scrambleFrame(finalText, locked, frame);
    frame += 1;
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }
    el.textContent = finalText;
    el.classList.add('ghost-edition-ready');
  };

  requestAnimationFrame(tick);
}

export function initGhostEdition() {
  document.querySelectorAll('[data-hacker-text]').forEach(revealElement);
}
