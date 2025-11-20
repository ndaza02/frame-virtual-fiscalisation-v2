// FRAME Virtual Fiscalisation marketing scripts (recreated)

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  initNavToggle();
  initHeaderScroll();
  initHeroVideo();
  initHeroTypewriter();
  initDevHubInteractions();
  initApiDemo();
  initPartnerForm();
  initLucideIcons();
  initCustomCursor();
  initAnimations();
});

function setCurrentYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initLucideIcons() {
  if (!window.lucide || typeof window.lucide.createIcons !== "function") return;
  window.lucide.createIcons();
}

function initCustomCursor() {
  if (!window.matchMedia) return;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hasFinePointer || prefersReduced) return;

  let cursorDot = document.querySelector(".cursor-dot");
  let cursorOutline = document.querySelector(".cursor-outline");

  if (!cursorDot || !cursorOutline) {
    cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";
    cursorOutline = document.createElement("div");
    cursorOutline.className = "cursor-outline";
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
  }

  document.body.classList.add("has-custom-cursor");

  window.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;

    if (typeof cursorOutline.animate === "function") {
      cursorOutline.animate({ left: `${x}px`, top: `${y}px` }, { duration: 500, fill: "forwards" });
    } else {
      cursorOutline.style.left = `${x}px`;
      cursorOutline.style.top = `${y}px`;
    }
  });

  const hoverTargets = document.querySelectorAll(
    'a[href], button, [role="button"], input[type="submit"], input[type="button"]'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursorOutline.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovered"));
  });
}

function initHeroVideo() {
  const vid = document.querySelector(".hero__background-video");
  if (!vid) return;
  vid.muted = true;
  vid.playsInline = true;
  vid.setAttribute("playsinline", "");
  vid.setAttribute("muted", "");
  vid.setAttribute("autoplay", "");
  vid.setAttribute("loop", "");
  const play = () => {
    const p = vid.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        const once = () => {
          vid.play().catch(() => {});
          window.removeEventListener("pointerdown", once);
          window.removeEventListener("keydown", once);
        };
        window.addEventListener("pointerdown", once, { once: true });
        window.addEventListener("keydown", once, { once: true });
      });
    }
  };
  play();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) play();
  });
}

function initHeroTypewriter() {
  const titleEl = document.querySelector(".hero__title");
  const subtitleEl = document.querySelector(".hero__subtitle");
  if (!titleEl || !subtitleEl) return;

  const sequences = [
    {
      title: "Stay compliant in real time, without slowing down your growth.",
      subtitle:
        "FRAME Virtual Fiscalisation connects your POS, ERP, and online payments into a single compliant fiscalisation layer. Secure device orchestration, auditable e-receipts, and ZIMRA-ready reporting from day one.",
    },
    {
      title: "Make ZIMRA audits boring, not stressful.",
      subtitle:
        "Centralise fiscal data, keep clean audit trails, and generate ZIMRA-ready exports whenever your finance and risk teams need them.",
    },
  ];

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    titleEl.textContent = sequences[0].title;
    subtitleEl.textContent = sequences[0].subtitle;
    return;
  }

  let index = 0;
  const typeSpeed = 70;
  const eraseSpeed = 45;
  const holdDelay = 4500;
  const betweenDelay = 700;

  function typeText(text, cb) {
    let i = 0;
    titleEl.textContent = "";
    (function step() {
      if (i < text.length) {
        titleEl.textContent += text.charAt(i++);
        window.setTimeout(step, typeSpeed);
      } else if (cb) cb();
    })();
  }

  function eraseText(cb) {
    (function step() {
      const current = titleEl.textContent;
      if (!current.length) {
        if (cb) cb();
        return;
      }
      titleEl.textContent = current.slice(0, -1);
      window.setTimeout(step, eraseSpeed);
    })();
  }

  function showNext() {
    const current = sequences[index];
    subtitleEl.textContent = current.subtitle;
    typeText(current.title, () => {
      window.setTimeout(() => {
        eraseText(() => {
          index = (index + 1) % sequences.length;
          window.setTimeout(showNext, betweenDelay);
        });
      }, holdDelay);
    });
  }

  showNext();
}

function initNavToggle() {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".site-header__nav-toggle");
  if (!header) return;

  // Always use the inline pill nav; never switch into overlay mode
  header.classList.remove("site-header--mobile-nav");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initPartnerForm() {
  const form = document.querySelector(".partner-form");
  if (!form) return;
  const successEl = form.querySelector(".form__success");
  const fields = [
    { name: "name", label: "Full name" },
    { name: "company", label: "Company" },
    { name: "email", label: "Work email", type: "email" },
    { name: "country", label: "Country" },
    { name: "volume", label: "Estimated monthly receipts" },
  ];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;
    form.querySelectorAll(".form__error").forEach((el) => (el.textContent = ""));
    form.querySelectorAll(".form__input").forEach((input) => input.classList.remove("form__input--invalid"));
    if (successEl) successEl.textContent = "";

    fields.forEach((field) => {
      const input = form.querySelector(`[name="${field.name}"]`);
      const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
      if (!input || !errorEl) return;
      const value = input.value.trim();
      if (!value) {
        errorEl.textContent = `${field.label} is required.`;
        input.classList.add("form__input--invalid");
        isValid = false;
        return;
      }
      if (field.type === "email") {
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailPattern.test(value.toLowerCase())) {
          errorEl.textContent = "Enter a valid email address.";
          input.classList.add("form__input--invalid");
          isValid = false;
        }
      }
    });

    const terms = form.querySelector("#partner-terms");
    const termsError = form.querySelector('[data-error-for="terms"]');
    if (terms && termsError && !terms.checked) {
      termsError.textContent = "Please confirm you agree to be contacted.";
      isValid = false;
    }

    if (!isValid) {
      const firstInvalid = form.querySelector(".form__input--invalid") || terms;
      if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
      return;
    }

    if (successEl) {
      successEl.textContent =
        "Thanks for your interest — our partner team will follow up within one business day.";
    }
    form.reset();
  });
}

function initApiDemo() {
  const button = document.querySelector(".developer__try-button");
  const responseEl = document.querySelector(".developer__response");
  if (!button || !responseEl) return;

  button.addEventListener("click", () => {
    const startTime = performance.now();
    responseEl.classList.remove("developer__response--error");
    responseEl.textContent = "Sending mock fiscal receipt...";
    button.disabled = true;

    const payload = {
      deviceId: "ZIMRA-HQ-001",
      receiptNumber: "INV-24801",
      currency: "ZWL",
      totalAmount: 1250.0,
      taxAmount: 187.5,
    };

    window.setTimeout(() => {
      const latency = Math.round(performance.now() - startTime);
      const mockResponse = {
        status: "ok",
        message: "Mock fiscal receipt accepted",
        receiptId: "RCPT-" + Math.floor(100000 + Math.random() * 900000),
        deviceId: payload.deviceId,
        totalAmount: payload.totalAmount,
        currency: payload.currency,
        complianceStatus: "COMPLIANT",
        latencyMs: latency,
        endpoint: "/v1/receipts",
      };
      responseEl.textContent = JSON.stringify(mockResponse, null, 2);
      button.disabled = false;
    }, 650);
  });
}

function initDevHubInteractions() {
  const body = document.body;
  if (!body || !body.classList.contains("page--devhub")) return;
  const tocRoot = document.querySelector(".page__body > h3:first-of-type + ul");
  if (!tocRoot) return;
  const tocLinks = Array.from(tocRoot.querySelectorAll('a[href^="#"]'));
  if (!tocLinks.length || !("IntersectionObserver" in window)) return;

  const ids = tocLinks
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => href.slice(1));

  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const linkById = {};
  tocLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    linkById[href.slice(1)] = link;
  });

  const activate = (id) => {
    tocLinks.forEach((l) => l.classList.remove("dev-toc__link--active"));
    const active = linkById[id];
    if (active) active.classList.add("dev-toc__link--active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.target.offsetTop - b.target.offsetTop);
      if (!visible.length) return;
      const topMost = visible[0];
      if (topMost && topMost.target && topMost.target.id) activate(topMost.target.id);
    },
    { root: null, rootMargin: "-50% 0px -40% 0px", threshold: 0.1 }
  );

  sections.forEach((s) => observer.observe(s));
  if (ids[0]) activate(ids[0]);
}

function initAnimations() {
  if (typeof window.gsap === "undefined") return;
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
  const shouldReduce = prefersReduced || isMobile;

  const heroTargets = [
    ".hero__kicker",
    ".hero__title",
    ".hero__subtitle",
    ".hero__actions",
    ".hero__stats",
  ];

  const hasHero = heroTargets.some((sel) => document.querySelector(sel));

  if (shouldReduce) {
    if (hasHero) window.gsap.set(heroTargets, { autoAlpha: 1, y: 0, clearProps: "transform" });
  } else if (hasHero) {
    const tl = window.gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });
    tl.from(".hero__kicker", { autoAlpha: 0, y: 18 })
      .from(".hero__title", { autoAlpha: 0, y: 22 }, "-=0.3")
      .from(".hero__subtitle", { autoAlpha: 0, y: 20 }, "-=0.25")
      .from(".hero__actions", { autoAlpha: 0, y: 18 }, "-=0.25")
      .from(".hero__stats", { autoAlpha: 0, y: 18 }, "-=0.25");
  }

  if (shouldReduce || typeof window.ScrollTrigger === "undefined") return;
  const hasHeroSection = document.querySelector(".hero") && document.querySelector(".hero__background");
  window.gsap.registerPlugin(window.ScrollTrigger);
  if (hasHeroSection) {
    window.gsap.to(".hero__background", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}
