const { MalNil, MalList, MalValue } = require("./types");

const ns = {
  "+": (...numbers) => numbers.reduce((a, b) => a + b, 0),
  "-": (...numbers) => numbers.reduce((a, b) => a - b),
  "*": (...numbers) => numbers.reduce((a, b) => a * b),
  "/": (...numbers) => numbers.reduce((a, b) => Math.floor(a / b)),
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,

  "=": (a, b) => {
    const areBothMalValue = a instanceof MalValue && b instanceof MalValue;
    return areBothMalValue ? a.equals(b) : a === b;
  },

  "<=": (a, b) => a <= b,
  ">=": (a, b) => a >= b,

  prn: (symbol) => {
    console.log(symbol);
    return new MalNil();
  },

  list: (...args) => new MalList(args),

  "list?": (arg) => arg instanceof MalList,

  "empty?": (list) => list.isEmpty(),

  count: (list) => list.length(),
};

module.exports = { ns };
