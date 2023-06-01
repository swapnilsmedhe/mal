const deepEqual = (firstElement, secondElement) => {
  if (firstElement instanceof MalValue && secondElement instanceof MalValue) {
    return firstElement.equals(secondElement);
  }

  return firstElement === secondElement;
};

class MalValue {
  value;

  constructor(value) {
    this.value = value;
  }

  toString() {
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

  toString() {
    return "(" + this.value.map((x) => x.toString()).join(" ") + ")";
  }
}

class MalVector extends MalIterable {
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

class MalObject extends MalValue {
  constructor(value) {
    super(value);
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil };
