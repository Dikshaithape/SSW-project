/**
 * STRATOWATCH — Scientific Analytics Engine Main Script
 * Team CipheI / PCCOE Pune
 * Tanmay Joshi (125B1C170)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Enforce Editorial Ivory & Terracotta Theme
  document.body.classList.remove("theme-forest", "theme-obsidian");
  document.body.classList.add("theme-editorial");
  localStorage.setItem("stratowatch_theme_preset", "theme-editorial");
  localStorage.removeItem("polarwatch_theme_preset");

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
          { left: "\[", right: "\]", display: true },
          { left: "\(", right: "\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render notice:", e);
    }
  }
});
