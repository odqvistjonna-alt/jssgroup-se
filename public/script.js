/* JSS Group AB. Tonar in innehåll och ritar ut linjer när de kommer i bild.
   Allt annat sköts av CSS. Utan JavaScript syns sidan som vanligt, eftersom
   klassen js-anim aldrig sätts och de dolda lägena därmed aldrig gäller. */

(function () {
  "use strict";

  var root = document.documentElement;

  // Den som valt bort rörelse ska se sidan direkt, utan animationer.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("js-anim");
    return;
  }

  var targets = document.querySelectorAll(
    ".section > .inner > *, .card, .pr-head, .pr-facts"
  );

  function visa(el) {
    el.classList.add("is-visible");
  }

  // Äldre webbläsare utan IntersectionObserver får allt synligt på en gång.
  if (!("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, visa);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        visa(entry.target);
        observer.unobserve(entry.target); // varje element animeras bara en gång
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();
