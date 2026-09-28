(() => {
  "use strict";
  const pool = [[42,35],[67,28],[58,47],[31,26],[49,36],[63,24]];
  const student = new URLSearchParams(location.search).get("student") || "Student";
  const key = "inspireb-firsthalf-dreamb-paddle-order-" + student;
  let order;
  try { order = JSON.parse(localStorage.getItem(key) || "null"); } catch (_) {}
  const valid = Array.isArray(order) && order.length === pool.length && new Set(order).size === pool.length && order.every(index => Number.isInteger(index) && index >= 0 && index < pool.length);
  if (!valid) {
    order = pool.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    try { localStorage.setItem(key, JSON.stringify(order)); } catch (_) {}
  }
  window.DreamBRandomPaddle = fileNumber => pool[order[fileNumber - 23]] || null;
})();
