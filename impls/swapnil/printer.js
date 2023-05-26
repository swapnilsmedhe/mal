const { MalValue } = require("./types");

const printString = (malValue) => {
  if (malValue instanceof MalValue) {
    return malValue.printString();
  }
  return malValue.toString();
};

module.exports = { printString };
