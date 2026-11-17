// Full-screen photo viewer: open a photo, click to zoom to full size, arrows to move, Esc to close.
(function () {
  var photos = Array.prototype.slice.call(document.querySelectorAll(".photos img"));
  if (!photos.length || typeof HTMLDialogElement === "undefined") return;

  var dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Photo viewer");
  dlg.innerHTML =
    '<div class="lb-stage"><img class="lb-img fit" alt=""></div>' +
    '<button class="lb-btn lb-close" type="button" aria-label="Close">×</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">‹</button>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next photo">›</button>' +
    '<p class="lb-hint">Click the photo to zoom</p>';
  document.body.appendChild(dlg);

  var stage = dlg.querySelector(".lb-stage");
  var big = dlg.querySelector(".lb-img");
  var hint = dlg.querySelector(".lb-hint");
  var current = 0;

  function show(i) {
    current = (i + photos.length) % photos.length;
    big.classList.add("fit");
    big.classList.remove("full");
    big.src = photos[current].currentSrc || photos[current].src;
    big.alt = photos[current].alt;
    dlg.querySelector(".lb-prev").hidden = photos.length < 2;
    dlg.querySelector(".lb-next").hidden = photos.length < 2;
    hint.textContent = "Click the photo to zoom";
  }

  photos.forEach(function (img, i) {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Open photo: " + img.alt);
    function open() { show(i); dlg.showModal(); }
    img.addEventListener("click", open);
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  big.addEventListener("click", function (e) {
    e.stopPropagation();
    if (big.classList.contains("fit")) {
      // zoom in, keeping the clicked point under the cursor
      var r = big.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      big.classList.remove("fit");
      big.classList.add("full");
      stage.scrollLeft = fx * big.scrollWidth - stage.clientWidth / 2;
      stage.scrollTop = fy * big.scrollHeight - stage.clientHeight / 2;
      hint.textContent = "Click again to fit the screen";
    } else {
      big.classList.add("fit");
      big.classList.remove("full");
      hint.textContent = "Click the photo to zoom";
    }
  });

  stage.addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  dlg.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
