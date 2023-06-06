const printString = (value, printReadably = false) => {
  if (value instanceof MalValue) {
    return value.toString(printReadably);
  }

  return value.toString();
};

const deepEqual = (firstElement, secondElement) => {
  if (firstElement instanceof MalValue && secondElement instanceof MalValue) {
    return firstElement.equals(secondElement);
  }

  return firstElement === secondElement;
};

const createMalString = (str) =>
  str.replace(/\\(.)/g, (_, captured) => (captured === "n" ? "\n" : captured));

class MalValue {
  value;

  constructor(value) {
    this.value = value;
  }

  toString(printReadably = false) {
    return this.value.toString();
  }

  equals(otherMalValue) {
    return (
      otherMalValue instanceof MalValue && this.value === otherMalValue.value
    );
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalIterable extends MalValue {
  constructor(value) {
    super(value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  length() {
    return this.value.length;
  }

  get(position) {
    return this.value[position];
  }

  equals(otherMalValue) {
    if (!(otherMalValue instanceof MalIterable)) return false;
    if (this.length() !== otherMalValue.length()) return false;

    return this.value.every((element, index) =>
      deepEqual(element, otherMalValue.get(index))
    );
  }
}

class MalList extends MalIterable {
  constructor(value) {
    super(value);
  }

  toString(printReadably = false) {
    return "(" + this.value.map((x) => printString(x)).join(" ") + ")";
  }
}

class MalVector extends MalIterable {
  constructor(value) {
    super(value);
  }

  toString(printReadably = false) {
    return "[" + this.value.map((x) => printString(x)).join(" ") + "]";
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  toString(printReadably = false) {
    return "nil";
  }
}

class MalFunction extends MalValue {
  constructor(ast, bindings, env, fn) {
    super(ast);
    this.bindings = bindings;
    this.env = env;
    this.fn = fn;
  }

  toString(printReadably = false) {
    return "#function";
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  toString(printReadably = false) {
    if (printReadably) {
      return (
        '"' +
        this.value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n") +
        '"'
      );
    }

    return this.value;
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return this.value;
  }

  swap(fn, args) {
    let actualFn = fn;

    if (fn instanceof MalFunction) {
      actualFn = fn.fn;
    }

    this.value = actualFn.apply(null, [this.value, ...args]);
    return this.value;
  }

  toString(printReadably = false) {
    return "(atom " + printString(this.value) + ")";
  }
}

class MalObject extends MalValue {
  constructor(value) {
    super(value);
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalFunction,
  MalString,
  MalAtom,
  createMalString,
};
