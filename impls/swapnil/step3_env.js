const readline = require("readline");
const { readString } = require("./reader");
const { printString } = require("./printer");
const { MalSymbol, MalList, MalValue, MalVector, MalNil } = require("./types");
const { Env } = require("./env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (input) => readString(input);

const evalAst = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
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

  switch (ast.value[0].value) {
    case "def!":
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
    case "let*":
      const letEnv = new Env(env);
      const bindingList = ast.value[1];

      for (let index = 0; index < bindingList.value.length; index += 2) {
        const binding = bindingList.value[index];
        const value = bindingList.value[index + 1];
        letEnv.set(binding, EVAL(value, letEnv));
      }

      return EVAL(ast.value[2], letEnv);
  }

  const [fn, ...args] = evalAst(ast, env).value;

  return fn.apply(null, args);
};

const PRINT = (malValue) => printString(malValue);

const env = new Env();

env.set(new MalSymbol("+"), (...numbers) => numbers.reduce((a, b) => a + b, 0));
env.set(new MalSymbol("-"), (...numbers) => numbers.reduce((a, b) => a - b));
env.set(new MalSymbol("*"), (...numbers) => numbers.reduce((a, b) => a * b));
env.set(new MalSymbol("/"), (...numbers) =>
  numbers.reduce((a, b) => Math.floor(a / b))
);

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
