(function () {
  const state = {
    theme: localStorage.getItem("mk_theme") || "dark",
  };

  const els = {
    year: document.getElementById("year"),
    themeBtn: document.getElementById("themeBtn"),
    menuBtn: document.getElementById("menuBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
    copyEmailBtn: document.getElementById("copyEmailBtn"),
    copyLinkBtn: document.getElementById("copyLinkBtn"),
    emailMeBtn: document.getElementById("emailMeBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
    toast: document.getElementById("toast"),
    toastText: document.getElementById("toastText"),
    expandAllBtn: document.getElementById("expandAllBtn"),
    collapseAllBtn: document.getElementById("collapseAllBtn"),
    expandAllBtn2: document.getElementById("expandAllBtn2"),
    collapseAllBtn2: document.getElementById("collapseAllBtn2"),
  };

  // Year
  if (els.year) els.year.textContent = new Date().getFullYear();

  // Smooth scrolling (respect reduced motion)
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  // Theme handling (dark/light)
  function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";

    // Toggle body palette with a class switch
    document.body.classList.toggle("bg-slate-950", !isLight);
    document.body.classList.toggle("text-slate-100", !isLight);
    document.body.classList.toggle("bg-slate-50", isLight);
    document.body.classList.toggle("text-slate-900", isLight);

    // data attribute used by styles.css for light-mode patches
    document.documentElement.dataset.theme = theme;

    els.themeBtn?.setAttribute("aria-pressed", String(isLight));
    state.theme = theme;
    localStorage.setItem("mk_theme", theme);
  }

  applyTheme(state.theme);

  els.themeBtn?.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  // Mobile menu
  els.menuBtn?.addEventListener("click", () => {
    const isOpen = els.menuBtn.getAttribute("aria-expanded") === "true";
    els.menuBtn.setAttribute("aria-expanded", String(!isOpen));
    els.mobileMenu?.classList.toggle("hidden", isOpen);
  });

  // Close mobile menu on click
  els.mobileMenu?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    els.menuBtn?.setAttribute("aria-expanded", "false");
    els.mobileMenu.classList.add("hidden");
  });

  // Toast
  let toastTimer = null;
  function showToast(message) {
    if (!els.toast || !els.toastText) return;
    els.toastText.textContent = message;
    els.toast.classList.remove("hidden");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.add("hidden");
    }, 1600);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      return true;
    } catch {
      return false;
    }
  }

  // Copy actions
  els.copyEmailBtn?.addEventListener("click", async () => {
    const ok = await copyToClipboard("mk0592497@gmail.com");
    showToast(
      ok ? "Email copied to clipboard" : "Copy failed (browser blocked)",
    );
  });

  els.copyLinkBtn?.addEventListener("click", async () => {
    const ok = await copyToClipboard("https://ncert-chatbot-eta.vercel.app/");
    showToast(ok ? "Project link copied" : "Copy failed (browser blocked)");
  });

  els.emailMeBtn?.addEventListener("click", () => {
    window.location.href =
      "mailto:mk0592497@gmail.com?subject=" +
      encodeURIComponent("Hello Mukesh — Frontend Opportunity");
  });

  // Download summary
  els.downloadBtn?.addEventListener("click", () => {
    const lines = [
      "Mukesh Kumar",
      "Skills: HTML, CSS, JavaScript",
      "Email: mk0592497@gmail.com",
      "Project: https://ncert-chatbot-eta.vercel.app/",
      "",
      "Objective:",
      "Develop a complete web application by integrating HTML, CSS, and JavaScript, while ensuring performance, responsiveness, and cross-browser compatibility.",
      "",
      "Steps:",
      "1) Build a Full Web Application (Capstone Project): Developed NCERT Chatbot with interactive features, clean UI, structured design.",
      "2) Optimize for Performance: Optimized CSS/JS, reduced unnecessary resources, ensured smooth UX.",
      "3) Cross-Browser & Responsive: Tested on multiple browsers, responsive for mobile/tablet/desktop, fixed layout issues.",
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MukeshKumar_Capstone_Summary.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Summary downloaded");
  });

  // Accordion
  const steps = Array.from(document.querySelectorAll(".step"));

  function setStepOpen(stepEl, open) {
    const btn = stepEl.querySelector(".stepBtn");
    const body = stepEl.querySelector(".stepBody");
    const icon = stepEl.querySelector(".stepIcon");

    stepEl.dataset.open = String(open);
    btn?.setAttribute("aria-expanded", String(open));
    if (open) {
      body?.classList.remove("hidden");
      if (icon) icon.textContent = "−";
    } else {
      body?.classList.add("hidden");
      if (icon) icon.textContent = "+";
    }
  }

  // Initialize from data-open
  steps.forEach((s) => setStepOpen(s, s.dataset.open === "true"));

  steps.forEach((stepEl) => {
    const btn = stepEl.querySelector(".stepBtn");
    btn?.addEventListener("click", () => {
      const isOpen = stepEl.dataset.open === "true";
      setStepOpen(stepEl, !isOpen);
    });
  });

  function expandAll() {
    steps.forEach((s) => setStepOpen(s, true));
  }
  function collapseAll() {
    steps.forEach((s) => setStepOpen(s, false));
  }

  [els.expandAllBtn, els.expandAllBtn2].forEach((b) =>
    b?.addEventListener("click", expandAll),
  );
  [els.collapseAllBtn, els.collapseAllBtn2].forEach((b) =>
    b?.addEventListener("click", collapseAll),
  );

  // Improve anchor offset for sticky header
  function getHeaderOffset() {
    const header = document.querySelector("header");
    return header ? header.getBoundingClientRect().height + 8 : 0;
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const y =
      window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  // Basic runtime checks (non-invasive)
  window.addEventListener("error", () => {
    showToast("A script error occurred");
  });
})();
