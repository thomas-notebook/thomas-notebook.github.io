// Light / dark switch.
// By default the site follows the visitor's device. The button overrides it,
// and the choice is remembered (a tiny snippet in <head> applies it before the
// page paints, so there's no flash). The button is added here, so visitors
// without JavaScript simply get the automatic behaviour and no dead button.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";

  function label() {
    var next = current() === "dark" ? "light" : "dark";
    btn.textContent = next;
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
  }

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });

  // If the device switches and the visitor never chose, keep the label right
  if (media.addEventListener) media.addEventListener("change", label);

  label();
  var wrap = document.querySelector(".wrap");
  if (wrap) wrap.prepend(btn);
})();
