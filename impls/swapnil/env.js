class Env {
  outer;

  constructor(outer, binds = [], exprs = []) {
    this.outer = outer;
    this.data = {};
    this.#setBinds(binds, exprs);
  }

  #setBinds(binds, exprs) {
    binds.forEach((bind, index) => (this.data[bind] = exprs[index]));
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }

    if (this.outer) {
      return this.outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);

    if (!env) {
      throw `${symbol.value} not found`;
    }

    return env.data[symbol.value];
  }
}

module.exports = { Env };
