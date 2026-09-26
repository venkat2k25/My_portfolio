/**
 * Pointer-driven 3D tilt + glow-position effect used by project cards and
 * skill panels. Returns plain event handlers so any element can opt in with
 * `onPointerMove={handleTilt} onPointerLeave={resetTilt}`.
 */
export function handleTilt(event) {
  if (event.pointerType === "touch") return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  card.style.setProperty("--tilt-x", `${(0.5 - y) * 8}deg`);
  card.style.setProperty("--tilt-y", `${(x - 0.5) * 10}deg`);
  card.style.setProperty("--glow-x", `${x * 100}%`);
  card.style.setProperty("--glow-y", `${y * 100}%`);
}

export function resetTilt(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}
