const readline = require("readline");
const { readStr } = require("./reader");
const { printString } = require("./printer");
const { MalSymbol, MalList, MalValue, MalVector } = require("./types");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const env = {
  "+": (...numbers) => numbers.reduce((a, b) => a + b, 0),
  "-": (...numbers) => numbers.reduce((a, b) => a - b),
  "*": (...numbers) => numbers.reduce((a, b) => a * b),
  "/": (...numbers) => numbers.reduce((a, b) => Math.floor(a / b)),
};

const READ = (input) => readStr(input);

const evalAst = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value];
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
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
