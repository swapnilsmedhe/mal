const readline = require("readline");
const { readStr } = require("./reader");
const { printString } = require("./printer");
const {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalFunction,
} = require("./types");
const { Env } = require("./env");
const { ns } = require("./core");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (input) => readStr(input);

const createClosureFunction = (env, ast) => {
  const [_, binds, fnBody] = ast.value;
  const fn = (...args) => {
    const fnEnv = new Env(env, binds.value, args);
    return EVAL(fnBody, fnEnv);
  };
  return new MalFunction(fnBody, binds, env, fn);
};

const evalDo = (ast, env) => {
  const doLists = ast.value.slice(1);

  doLists.slice(0, -1).forEach((list) => EVAL(list, env));

  return doLists[doLists.length - 1];
};

const evalIf = (ast, env) => {
  const predicateResult = EVAL(ast.value[1], env);

  const listToExecute =
    !(predicateResult instanceof MalNil) && predicateResult !== false
      ? ast.value[2]
      : ast.value[3];

  return listToExecute !== undefined ? listToExecute : new MalNil();
};

const evalLetStar = (env, ast) => {
  const letEnv = new Env(env);
  const bindingList = ast.value[1];

  for (let index = 0; index < bindingList.value.length; index += 2) {
    const binding = bindingList.value[index];
    const value = bindingList.value[index + 1];
    letEnv.set(binding, EVAL(value, letEnv));
  }

  const form = ast.value[2] ? ast.value[2] : new MalNil();
  return [form, letEnv];
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
  while (true) {
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
        [ast, env] = evalLetStar(env, ast);
        break;

      case "do":
        ast = evalDo(ast, env);
        break;

      case "if":
        ast = evalIf(ast, env);
        break;

      case "fn*":
        ast = createClosureFunction(env, ast);
        break;
      default:
        const [fn, ...args] = evalAst(ast, env).value;

        if (fn instanceof MalFunction) {
          const oldEnv = fn.env;
          env = new Env(oldEnv, fn.bindings.value, args);
          ast = fn.value;
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = (malValue) => printString(malValue, true);

const initEnv = () => {
  const env = new Env();

  for (const symbol in ns) {
    env.set(new MalSymbol(symbol), ns[symbol]);
  }

  env.set(new MalSymbol("eval"), (ast) => EVAL(ast, env));

  EVAL(
    READ(
      '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
    ),
    env
  );
  return env;
};

const env = initEnv();

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
