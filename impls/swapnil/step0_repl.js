const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (input) => input;

const EVAL = (input) => input;

const PRINT = (input) => input;

const rep = (input) => PRINT(EVAL(READ(input)));

const repl = () =>
  rl.question("user> ", (line) => {
    console.log(rep(line));
    repl();
  });

repl();
