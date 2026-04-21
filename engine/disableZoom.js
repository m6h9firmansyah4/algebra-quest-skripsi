// ===============================
// DISABLE PAGE ZOOM (GLOBAL)
// ===============================

// cegah ctrl + wheel zoom
window.addEventListener("wheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// cegah shortcut keyboard zoom
window.addEventListener("keydown", function (e) {
  const blocked =
    (e.ctrlKey || e.metaKey) &&
    (e.key === "+" ||
     e.key === "-" ||
     e.key === "=" ||
     e.key === "_" ||
     e.key === "Add" ||
     e.key === "Subtract" ||
     e.key === "0");

  if (blocked) {
    e.preventDefault();
  }
});

// cegah pinch zoom pada touch device
document.addEventListener("touchmove", function (e) {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// cegah double tap zoom
let lastTouchEnd = 0;
document.addEventListener("touchend", function (e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// safari iOS
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});
document.addEventListener("gesturechange", function (e) {
  e.preventDefault();
});
document.addEventListener("gestureend", function (e) {
  e.preventDefault();
});