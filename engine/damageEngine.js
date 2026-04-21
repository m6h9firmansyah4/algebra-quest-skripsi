export function spawnDamage(type, damage, from = "player") {
  const container = document.getElementById("battleEffects");
  if (!container) return;

  const el = document.createElement("div");

  el.className = "projectile shape-" + type;
  el.innerText = damage;

  container.appendChild(el);

  const startX = from === "player" ? 80 : 300;
  const endX = from === "player" ? 300 : 80;

  el.style.left = startX + "px";
  el.style.top = "200px";

  requestAnimationFrame(() => {
    el.style.transform = `translate(${endX - startX}px,0)`;
    el.style.opacity = 0;
  });

  setTimeout(() => el.remove(), 600);
}