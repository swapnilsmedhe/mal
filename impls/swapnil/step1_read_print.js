const readline = require("readline");
const { readStr } = require("./reader");
const { printString } = require("./printer");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (input) => readStr(input);

const EVAL = (input) => input;

const PRINT = (malValue) => printString(malValue);

const rep = (input) => PRINT(EVAL(READ(input)));

const repl = () =>
  rl.question("user> ", (line) => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });

repl();
