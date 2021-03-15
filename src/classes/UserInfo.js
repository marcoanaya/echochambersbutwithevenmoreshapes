export default class UserInfo {
  constructor() {
    this.uid = '';
    this.name = '';
    this.score = 0;
    this.shape = {
      sides: 3,
      c: 'black',
    };
    this.params = {
      A: 2, B: 1, C: 2,
    };
  }

  add(attrs) {
    if (!attrs) return this;
    ({
      uid: this.uid,
      name: this.name,
      shape: this.shape,
      params: this.params,
    } = { ...this, ...attrs });
    this.score = (
      (this.params.A + 6)
        * (3 * (this.params.B > 1) + 1)
        * 9 - Math.abs(2 - this.params.C))
      + Math.random() * 20;
    return this;
  }

  toString() {
    const { uid: _u, score: _s, ...toPrint } = this;
    return Object.entries(toPrint).map(([key, val]) => `\n  ${key}: ${
      key !== 'shape'
        ? key !== 'params'
          ? val
          : JSON.stringify(val)
        : `${val.c} ${{
          3: 'triangle', 4: 'square', 6: 'hexagon', 24: 'circle',
        }[val.sides]}`
    }`).join('');
  }
}
