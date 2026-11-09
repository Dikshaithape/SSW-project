/**
 * STRATOWATCH — Scientific Analytics Engine Main Script
 * Team CipheI / PCCOE Pune
 * Tanmay Joshi (125B1C170)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Multi-Theme Preset Controller
  const themeBtns = document.querySelectorAll(".theme-pill-btn");
  const savedTheme = localStorage.getItem("stratowatch_theme_preset") || "theme-editorial";

  function applyTheme(themeName) {
    document.body.classList.remove("theme-editorial", "theme-forest", "theme-obsidian");
    if (themeName !== "theme-editorial") {
      document.body.classList.add(themeName);
    }
    localStorage.setItem("stratowatch_theme_preset", themeName);

    themeBtns.forEach(btn => {
      if (btn.getAttribute("data-theme") === themeName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Re-render chart colors if available
    if (window.updateChartColors) {
      window.updateChartColors(themeName);
    }
  }

  // Set initial theme
  applyTheme(savedTheme);

  // Attach button click listeners
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-theme");
      applyTheme(selected);
    });
  });

  // 2. Active Navigation Highlight on Scroll
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id], header[id]");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // 3. Render KaTeX equations if available
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render notice:", e);
    }
  }
});
