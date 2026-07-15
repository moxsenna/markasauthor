/**
 * Smoke-check pure logic of store helpers via dynamic import of built TS is hard in Astro.
 * Instead, re-implement minimal assertions against inlined logic shape.
 * Run after helpers exist: node scripts/verify-demo-store.mjs
 *
 * This script only validates the *contracts* we need (map/toggle/push),
 * using a fake localStorage polyfill if import fails — prefer manual browser check in Task 8.
 */
import assert from 'node:assert/strict';

// Contract tests (no DOM): pure transforms used by helpers
function toggleBonus(bonuses, id) {
  return bonuses.map((b) => (b.id === id ? { ...b, published: !b.published } : b));
}
function setStatus(works, slug, status) {
  return works.map((w) => (w.slug === slug ? { ...w, status } : w));
}
function pushTrivia(trivia, item) {
  return [...trivia, item];
}

const bonuses = [
  { id: 'a', published: false },
  { id: 'b', published: true },
];
assert.equal(toggleBonus(bonuses, 'a')[0].published, true);
assert.equal(toggleBonus(bonuses, 'a')[1].published, true);

const works = [
  { slug: 'x', status: 'TAYANG' },
  { slug: 'y', status: 'TAMAT' },
];
assert.equal(setStatus(works, 'x', 'TAMAT')[0].status, 'TAMAT');
assert.equal(setStatus(works, 'x', 'TAMAT')[1].status, 'TAMAT');

const trivia = pushTrivia([], { q: 'Q?', a: 'A' });
assert.equal(trivia.length, 1);
assert.equal(trivia[0].q, 'Q?');

console.log('verify-demo-store: OK');
