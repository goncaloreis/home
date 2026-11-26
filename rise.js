// Each figure's strokes stand up, attempt by attempt, as the figure comes into view:
// line 2 of the creed, enacted. Only figures entirely below the screen when the reader
// first scrolls are laid down, so nothing visible ever empties, and without this script,
// or with reduced motion, every figure is simply drawn.
(() => {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const figures = [...document.querySelectorAll(".proof .fig")];
  const watch = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("down");
      entry.target.classList.add("up");
      watch.unobserve(entry.target);
    }
  }, { threshold: 0.35 });

  const arm = () => {
    window.removeEventListener("scroll", arm);
    const bottom = window.innerHeight;
    for (const fig of figures) {
      if (fig.getBoundingClientRect().top > bottom) {
        fig.classList.add("down");
        watch.observe(fig);
      }
    }
  };
  window.addEventListener("scroll", arm, { passive: true });
})();
