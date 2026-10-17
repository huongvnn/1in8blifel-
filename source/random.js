/**
 * Pseudo-random generator and statistical utilities for 1in8b simulation
 */

export function createRNG(seed = Date.now()) {
  let s = seed >>> 0;
  return function rnd() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rnd = Math.random;

export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export function randomInt(min, max, randomFn = rnd) {
  return Math.floor(randomFn() * (max - min + 1)) + min;
}

export function chance(prob, randomFn = rnd) {
  return randomFn() < prob;
}

export function pick(array, randomFn = rnd) {
  if (!array || !array.length) return null;
  return array[Math.floor(randomFn() * array.length)];
}

export function weightedPick(items, weights, randomFn = rnd) {
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
  }
  let r = randomFn() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}

export function weightedPickObj(weightsObj, randomFn = rnd) {
  const keys = Object.keys(weightsObj);
  let total = 0;
  for (const k of keys) {
    total += weightsObj[k];
  }
  let r = randomFn() * total;
  for (const k of keys) {
    if (r < weightsObj[k]) return k;
    r -= weightsObj[k];
  }
  return keys[keys.length - 1];
}
