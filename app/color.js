export default class Color {
  constructor(r, g, b) {
    this.r = Number(r) || 0;
    this.g = Number(g) || 0;
    this.b = Number(b) || 0;
  }

  hex() {
    const num = this.r * 0x10000 + this.g * 0x100 + this.b;
    const str = num.toString(16);
    return '#' + '000000'.slice(str.length) + str;
  }
}
