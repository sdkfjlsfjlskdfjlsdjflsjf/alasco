const assert = require('assert');

/* 
Dices (No UI required)
We should check if we have a good chance of winning in a game with two dices. The values of
the dices are added. We start the game with 50c. The profit is computed with to following table
Sum Payback Profit
12 4x input +1,50 Euro
11 3x input +1,00 Euro
10 2x input +0,50 Euro
7,8,9 input back +0,00 Euro
2,3,4,5,6 none -0,50 Euro
Is it good to take part in this game? Try in a loop with 1000 iterations, if you lose or
win in the long run. You can simulate the dices with random numbers. (Use your favourite...
*/

function roll() {
  return Math.floor(Math.random() * 10) + 2;
}

function turn(input, dice) {
  if (!Number.isInteger(dice)
    || dice < 2
    || dice > 12
    || typeof (input) !== 'number'
    || Number.isNaN(input)) {
    throw new Error("Invalid input");
  }
  switch (dice) {
    case 12:
      return 4 * input + 1.5;
    case 11:
      return 3 * input + 1;
    case 10:
      return 2 * input + 0.5;
    case 7:
    case 8:
    case 9:
      return input;
    default:
      return input - 0.5;
  }
}

assert.throws(() => turn(NaN, NaN));
assert.throws(() => turn('tree fiddy', 2));
assert.throws(() => turn(0.5, -1));
assert.throws(() => turn(0.5, 0.5));
assert.throws(() => turn(0.5, 1));
assert.throws(() => turn(0.5, 13));

const rolls = [...Array(100).keys()].map(() => roll());
assert(rolls.filter(roll => roll < 2).length === 0);
assert(rolls.filter(roll => roll > 12).length === 0);
assert(turn(1, 2) === 0.5);
assert(turn(0, 6) === -0.5);
assert(turn(10, 12) === 41.5);
assert(turn(10, 11) === 31);
assert(turn(10, 10) === 20.5);

function stopWhenYouLoose(initialBalance, loopCount = 1000) {
  let balance = initialBalance;
  let goodIdea = true;
  for (let i = 0; i < loopCount; i = i + 1) {
    if (balance < initialBalance) {
      goodIdea = false;
      break;
    }
    balance = turn(balance, roll());
  }
  return goodIdea;
}

function stopWhenYouRunOut(initialBalance, loopCount = 1000) {
  let balance = initialBalance;
  let goodIdea = true;
  for (let i = 0; i < 1000; i = i + 1) {
    if (balance < 0) {
      goodIdea = false;
      break;
    }
    balance = turn(balance, roll());
  }
  return goodIdea;
}

function unlimitedCredit(initialBalance, loopCount = 1000) {
  let balance = initialBalance;
  for (let i = 0; i < 1000; i = i + 1) {
    balance = turn(balance, roll());
  }
  if (balance > initialBalance) { return true; }
  return false;
}

// Try 10 runs of 1000 for the 3 modes
console.log(`Stop when you lose money: ${
  [...Array(10).keys()]
    .map(() => stopWhenYouLoose(0.5))
    .filter(Boolean)
    .length > 5 ? 'good!' : 'bad!'
  }`);
console.log(`Stop when you run out of money: ${
  [...Array(10).keys()]
    .map(() => stopWhenYouRunOut(0.5))
    .filter(Boolean)
    .length > 5 ? 'good!' : 'bad!'
  }`);
console.log(`Take out a loan: ${
  [...Array(10).keys()]
    .map(() => unlimitedCredit(0.5))
    .filter(Boolean)
    .length > 5 ? 'good!' : 'bad!'
  }`);
