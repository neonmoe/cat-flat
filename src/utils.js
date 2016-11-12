function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function processDelta(delta) {
  return clamp(delta / 1000.0, 0.001, 0.03);
}
