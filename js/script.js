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

import './ElectricBorder.css';

const ElectricBorder = ({ children, color = '#5227FF', speed = 1, chaos = 1, thickness = 2, className, style }) => {
  const rawId = useId().replace(/[:]/g, '');
  const filterId = `turbulent-displace-${rawId}`;
  const svgRef = useRef(null);
  const rootRef = useRef(null);
  const strokeRef = useRef(null);

  const updateAnim = () => {
    const svg = svgRef.current;
    const host = rootRef.current;
    if (!svg || !host) return;

    if (strokeRef.current) {
      strokeRef.current.style.filter = `url(#${filterId})`;
    }

    const width = Math.max(1, Math.round(host.clientWidth || host.getBoundingClientRect().width || 0));
    const height = Math.max(1, Math.round(host.clientHeight || host.getBoundingClientRect().height || 0));

    const dyAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dy"]'));
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dx"]'));
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (speed || 1));
    [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

    const disp = svg.querySelector('feDisplacementMap');
    if (disp) disp.setAttribute('scale', String(30 * (chaos || 1)));

    const filterEl = svg.querySelector(`#${CSS.escape(filterId)}`);
    if (filterEl) {
      filterEl.setAttribute('x', '-200%');
      filterEl.setAttribute('y', '-200%');
      filterEl.setAttribute('width', '500%');
      filterEl.setAttribute('height', '500%');
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach(a => {
        if (typeof a.beginElement === 'function') {
          try {
            a.beginElement();
          } catch {
            console.warn('ElectricBorder: beginElement failed, this may be due to a browser limitation.');
          }
        }
      });
    });
  };

  useEffect(() => {
    updateAnim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, chaos]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver(() => updateAnim());
    ro.observe(rootRef.current);
    updateAnim();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vars = {
    ['--electric-border-color']: color,
    ['--eb-border-width']: `${thickness}px`
  };

  return (
    <div ref={rootRef} className={`electric-border ${className ?? ''}`} style={{ ...vars, ...style }}>
      <svg ref={svgRef} className="eb-svg" aria-hidden focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="eb-layers">
        <div ref={strokeRef} className="eb-stroke" />
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>

      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
