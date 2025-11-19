// Godx Coderz UI Scripts

// ===== Utilities =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Year
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile nav toggle =====
const menuBtn = $(".menu-toggle");
const nav = document.querySelector("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  // Close on link click (mobile)
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));
}

// ===== Active nav link (fallback if class not set) =====
(function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// ===== Typewriter (only on pages with #typed-text) =====
(function typewriter() {
  const el = $("#typed-text");
  if (!el) return;

  const phrases = [
    "We ship production‑ready code.",
    "We design experiences users love.",
    "We are Godx Coderz."
  ];
  let p = 0, i = 0, dir = 1;

  const speed = () => (dir > 0 ? 80 : 40);

  function tick() {
    el.textContent = phrases[p].slice(0, i);
    i += dir;

    if (i === phrases[p].length + 1) {
      setTimeout(() => { dir = -1; }, 800);
    } else if (i === 0) {
      p = (p + 1) % phrases.length;
      dir = 1;
    }
    setTimeout(tick, speed());
  }
  tick();
})();

// ===== Auth (demo via localStorage) =====
const AUTH_KEY = "gx_user_email";
function getUserEmail(){ try { return localStorage.getItem(AUTH_KEY); } catch { return null; } }
function setUserEmail(v){ try { localStorage.setItem(AUTH_KEY, v); } catch {} }
function clearUser(){ try { localStorage.removeItem(AUTH_KEY); } catch {} }

function updateAuthUI() {
  const email = getUserEmail();
  const authLink = $("#authLink");
  const chip = $("#userChip");

  if (!authLink || !chip) return;

  if (email) {
    chip.hidden = false;
    chip.textContent = `Hi, ${email.split("@")[0]}`;
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.onclick = (e) => {
      e.preventDefault();
      clearUser();
      chip.hidden = true;
      authLink.textContent = "Login";
      authLink.href = "login.html";
      location.reload();
    };
  } else {
    chip.hidden = true;
    authLink.textContent = "Login";
    authLink.href = "login.html";
    authLink.onclick = null;
  }
}
updateAuthUI();

// Login form handler
const loginForm = $("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email")?.value.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    setUserEmail(email);
    updateAuthUI();
    // Simple success + redirect
    alert("Logged in! We'll be in touch soon.");
    window.location.href = "index.html";
  });
}

// ===== Reviews (Our Creations) — localStorage demo =====
const REVIEWS_KEY = "gx_reviews";
function loadReviews(){ try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]"); } catch { return []; } }
function saveReviews(list){ try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(list)); } catch {} }

const reviewForm = $("#review-form");
const reviewsUl = $("#reviews");

function renderReviews() {
  if (!reviewsUl) return;
  const items = loadReviews();
  reviewsUl.innerHTML = items.length ? "" : "<li class='muted'>No posts yet. Be the first!</li>";
  items.forEach(({name, need, rating, message, ts}) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card" style="margin-bottom:12px">
        <strong>${escapeHtml(name)}</strong> <span class="muted">• ${new Date(ts).toLocaleString()}</span>
        <div class="muted">Requested: ${escapeHtml(need)} &nbsp; | &nbsp; Rating: ${"★".repeat(+rating)}${"☆".repeat(5-+rating)}</div>
        <p style="margin:.4rem 0 0">${escapeHtml(message)}</p>
      </div>
    `;
    reviewsUl.appendChild(li);
  });
}
function escapeHtml(s){ return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

if (reviewForm) {
  renderReviews();
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name").value.trim();
    const need = $("#need").value.trim();
    const rating = $("#rating").value;
    const message = $("#message").value.trim();
    if (!name || !need || !rating || !message) return alert("Please complete all fields.");
    const list = loadReviews();
    list.unshift({name, need, rating, message, ts: Date.now()});
    saveReviews(list);
    reviewForm.reset();
    renderReviews();
  });
}

// ===== Lightbox for gallery =====
const lightbox = $("#lightbox");
if (lightbox) {
  const img = $("#lightboxImg");
  const caption = $("#lightboxCaption");
  const closeBtn = $("#lightboxClose");

  $$(".shot img").forEach(el => {
    el.style.cursor = "zoom-in";
    el.addEventListener("click", () => {
      img.src = el.src;
      img.alt = el.alt;
      caption.textContent = el.closest("figure")?.querySelector("figcaption")?.textContent || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

import { useEffect, useId, useLayoutEffect, useRef } from 'react';
/* electric-border.js — small helper to size the SVG filter animation */
(function() {
  try {
    const svg = document.querySelector('.eb-svg-defs');
    if (!svg) return;

    function update() {
      const width = Math.max(1, Math.round(window.innerWidth));
      const height = Math.max(1, Math.round(window.innerHeight));

      // find the animate elements and update values
      const dyAnims = svg.querySelectorAll('feOffset > animate[attributeName="dy"]');
      if (dyAnims && dyAnims.length >= 2) {
        dyAnims[0].setAttribute('values', `${height};0`);
        dyAnims[1].setAttribute('values', `0;-${height}`);
      }
      const disp = svg.querySelector('feDisplacementMap');
      if (disp) disp.setAttribute('scale', String(Math.max(14, Math.round(Math.min(width, height) * 0.04))));
    }

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });
    // run initially
    update();
  } catch (e) {
    console.warn('Electric border init failed', e);
  }
})();



