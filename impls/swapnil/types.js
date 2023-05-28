class MalValue {
  value;

  constructor(value) {
    this.value = value;
  }

  toString() {
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

  toString() {
    return "(" + this.value.map((x) => x.toString()).join(" ") + ")";
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return "[" + this.value.map((x) => x.toString()).join(" ") + "]";
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  toString() {
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
