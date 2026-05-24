(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.style.cssText =
      "display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999;cursor:zoom-out;align-items:center;justify-content:center;";
    var img = document.createElement("img");
    img.style.cssText = "max-width:90vw;max-height:90vh;border-radius:4px;";
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function () {
      overlay.style.display = "none";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") overlay.style.display = "none";
    });

    document.querySelectorAll(".post-content img").forEach(function (el) {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function () {
        img.src = el.src;
        overlay.style.display = "flex";
      });
    });
  });
})();
