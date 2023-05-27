class MalValue {
  value;

  constructor(value) {
    this.value = value;
  }

  printString() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  printString() {
    return "(" + this.value.map((x) => x.printString()).join(" ") + ")";
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  printString() {
    return "[" + this.value.map((x) => x.printString()).join(" ") + "]";
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  printString() {
    return "nil";
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalObject extends MalValue {
  constructor(value) {
    super(value);
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalBool };
