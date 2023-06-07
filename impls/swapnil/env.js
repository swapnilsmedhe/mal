const { MalList } = require("./types");

class Env {
  outer;

  constructor(outer, binds = [], exprs = []) {
    this.outer = outer;
    this.data = {};
    this.#setBinds(binds, exprs);
  }

  #setBinds(binds, exprs) {
    for (let i = 0; i < binds.length; i++) {
      if (binds[i].value === "&") {
        console.log(binds[i + 1], "----");
        this.set(binds[i + 1], new MalList(exprs.slice(i)));
        return;
      }
      this.set(binds[i], exprs[i]);
    }
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
