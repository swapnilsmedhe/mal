const {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalBool,
} = require("./types");

class Reader {
  #tokens;
  #position;

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const token = this.peek();
    this.#position++;
    return token;
  }
}

const tokenize = (str) => {
  const regex =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(regex)]
    .map((tokenInfo) => tokenInfo[1])
    .filter((token) => token);
};

const readSeq = (reader, closingSymbol) => {
  const ast = [];

  reader.next();

  while (reader.peek() !== closingSymbol) {
    if (reader.peek() === undefined) {
      throw "unbalanced";
    }
    ast.push(readForm(reader));
  }

  reader.next();
  return ast;
};

const readList = (reader) => {
  const ast = readSeq(reader, ")");
  return new MalList(ast);
};

const readVector = (reader) => {
  const ast = readSeq(reader, "]");
  return new MalVector(ast);
};

const readAtom = (reader) => {
  const token = reader.next();
  const isNumber = token.match(/^-?[0-9]+$/);

  if (isNumber) {
    return parseInt(token);
  }

  switch (token) {
    case "true":
      return new MalBool(true);
    case "false":
      return new MalBool(false);
    case "nil":
      return new MalNil();
    default:
      return new MalSymbol(token);
  }
};

const readForm = (reader) => {
  const token = reader.peek();
  switch (token) {
    case "(":
      return readList(reader);
    case "[":
      return readVector(reader);
    default:
      return readAtom(reader);
  }
};

const readString = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return readForm(reader);
};

module.exports = { readString };
