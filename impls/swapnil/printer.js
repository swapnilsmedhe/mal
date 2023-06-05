const { MalValue } = require("./types");

const printString = (value, printReadably = false) => {
  if (value instanceof MalValue) {
    return value.toString(printReadably);
  }

  return value.toString();
};

module.exports = { printString };
