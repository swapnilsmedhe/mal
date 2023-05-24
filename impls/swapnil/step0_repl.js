const READ = (input) => input;

const EVAL = (input) => input;

const PRINT = (input) => input;

const rep = (input) => PRINT(EVAL(READ(input)));

const main = () => {
  process.stdout.write("user> ");
  process.stdin.on("data", (data) => {
    process.stdout.write(rep(data));
    process.stdout.write("user> ");
  });
};

main();
