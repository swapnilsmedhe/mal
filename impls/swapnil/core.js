const {
  MalNil,
  MalList,
  MalValue,
  MalString,
  MalAtom,
  deepEqual,
  MalVector,
} = require("./types");
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

  "=": (a, b) => deepEqual(a, b),

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

  str: (...args) => {
    return new MalString(args.map((arg) => printString(arg, false)).join(""));
  },

  "read-string": (str) => readStr(printString(str)),

  slurp: (filename) => new MalString(fs.readFileSync(filename.value, "utf8")),

  atom: (value) => new MalAtom(value),
  "atom?": (value) => value instanceof MalAtom,
  deref: (atom) => atom.deref(),
  "reset!": (atom, value) => atom.reset(value),
  "swap!": (atom, fn, ...args) => atom.swap(fn, args),

  cons: (value, list) => new MalList([value, ...list.value]),
  concat: (...lists) => new MalList(lists.flatMap((x) => x.value)),

  vec: (list) => new MalVector([...list.value]),
  nth: (list, n) => list.nth(n),
  first: (list) => (list instanceof MalNil ? new MalNil() : list.first()),
  rest: (list) => (list instanceof MalNil ? new MalList([]) : list.rest()),
};

module.exports = { ns };
