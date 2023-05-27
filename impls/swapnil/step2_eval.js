const readline = require("readline");
const { readString } = require("./reader");
const { printString } = require("./printer");
const { MalSymbol, MalList, MalValue } = require("./types");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const env = {
  "+": (...numbers) =>
    numbers.reduce((a, b) => new MalValue(a.value + b.value), new MalValue(0)),
  "-": (...numbers) =>
    numbers.reduce((a, b) => new MalValue(a.value - b.value)),
  "*": (...numbers) =>
    numbers.reduce((a, b) => new MalValue(a.value * b.value)),
  "/": (...numbers) =>
    numbers.reduce((a, b) => new MalValue(Math.floor(a.value / b.value))),
};

const READ = (input) => readString(input);

const evalAst = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value];
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  return ast;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return evalAst(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  const [fn, ...args] = evalAst(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => printString(malValue);

const rep = (input) => PRINT(EVAL(READ(input), env));

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
