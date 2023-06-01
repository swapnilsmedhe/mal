const readline = require("readline");
const { readString } = require("./reader");
const { printString } = require("./printer");
const { MalSymbol, MalList, MalVector, MalNil } = require("./types");
const { Env } = require("./env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (input) => readString(input);

const createClosureFunction = (env, ast) => {
  return (...args) => {
    const fnEnv = new Env(env);
    const bindings = ast.value[1].value;

    bindings.forEach((binding, index) => fnEnv.set(binding, args[index]));
    return EVAL(ast.value[2], fnEnv);
  };
};

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

      return ast.value[2] ? EVAL(ast.value[2], letEnv) : new MalNil();

    case "do":
      const doLists = ast.value.slice(1);

      const lastList = doLists.reduce(
        (_, statement) => evalAst(statement, env),
        ""
      );
      return EVAL(lastList, env);

    case "if":
      const predicateResult = EVAL(ast.value[1], env);

      return !(predicateResult instanceof MalNil) && predicateResult !== false
        ? EVAL(ast.value[2], env)
        : EVAL(ast.value[3], env);

    case "fn*":
      const closureFn = createClosureFunction(env, ast);
      closureFn.toString = () => "#function";
      return closureFn;
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
env.set(new MalSymbol(">"), (a, b) => a > b);
env.set(new MalSymbol("<"), (a, b) => a < b);
env.set(new MalSymbol("="), (a, b) => a === b);
env.set(new MalSymbol("<="), (a, b) => a <= b);
env.set(new MalSymbol(">="), (a, b) => a >= b);

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
