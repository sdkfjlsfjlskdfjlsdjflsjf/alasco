const assert = require('assert');

function validateRect(rect) {
  if (Array.isArray(rect)
    && rect.length === 4
    && rect.filter(num => typeof (num) !== 'number' || Number.isNaN(num)).length === 0
  ) {
    return true;
  }
  return false;
}

function testIntersect(rectA, rectB) {
  if (!validateRect(rectA) || !validateRect(rectB)) {
    throw new Error("Invalid Rectangle");
  }

  if (rectA[0] >= rectB[0]
    && rectA[1] >= rectB[1]
    && rectA[2] <= rectB[2]
    && rectA[3] <= rectB[3]) {
    return true;
  }
  return false;
}

const rects = [
  [0, 0, 0, 0],
  [1, 1, 10, 30],
  [0, 0, 20, 40],
  [0, 0, 20, 40],
  [],
  ['1', 0, 0, 0],
  [NaN, 0, 0, 0]
];

assert(testIntersect(rects[0], rects[1]) === false);
assert(testIntersect(rects[1], rects[2]) === true);
assert(testIntersect(rects[2], rects[3]) === true);
assert.throws(() => testIntersect(rects[0], rects[4]));
assert.throws(() => testIntersect(rects[0], rects[5]));
assert.throws(() => testIntersect(rects[0], rects[6]));
