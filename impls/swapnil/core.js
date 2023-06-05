const { MalNil, MalList, MalValue, MalString } = require("./types");
const { readStr } = require("./reader");
const fs = require("fs");
const { printString } = require("./printer");

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

  count: (list) => (list instanceof MalNil ? 0 : list.length()),

  "read-string": (str) => readStr(printString(str)),

  slurp: (filename) => new MalString(fs.readFileSync(filename.value, "utf8")),
};

module.exports = { ns };
