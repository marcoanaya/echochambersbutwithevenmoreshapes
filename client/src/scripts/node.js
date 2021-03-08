import {
  Vec, randWithin, increment, maxSigSize, clr, P,
} from './utils';

/* Node class
 * Represents each individual shape
 */
export default class Node {
  constructor(i, w, h, g) {
    this.name = i;
    this.graph = g;
    // polarity coefficient
    this.c = random(-100, 100);
    this.engagement = Math.random();

    // random attributes for more visual aesthetics
    // todo: make shapes more interesting
    this.r = Math.random();
    this.pos = createVector(...[w / 3, h / 2.1].map((x) => P.random(-x, x)));

    this.sides = random([3, 4, 6, 24]);
    this.radii = [25, 15].map((x) => randWithin(x, x / 3));

    // initializes 'signal' (circle that comes out of shape)
    this.signalSize = 0;
  }

  /* graphic representation of shape and its 'signal' */
  draw(p) {
    p.push();
    p.translate(this.pos);
    this.drawSelf(p);
    this.drawSignal(p);
    p.pop();
  }

  drawSelf(p) {
    p.push();
    p.fill(...clr(this.c));
    p.noStroke();

    p.rotateX((this.r * p.frameCount) / 10);
    p.rotateY((this.r * p.frameCount) / 10);
    p.torus(...this.radii, this.sides);
    p.pop();
  }

  drawSignal(p) {
    p.push();
    p.fill(...clr(this.c));
    p.stroke(...clr(this.c));
    p.rotateX(P.PI / 2);
    p.rotateY(0);
    p.cylinder(this.signalSize, 20, 24, 1, false, false);
    p.pop();
  }

  /* updates the shapes position, and other attributes
      (randomly or predetermined) */
  update() {
    this.updateSignal();
    this.c = increment(this.c, P.random(-5, 5), 128);
    this.pos.add(Vec.random2D().mult(2));
  }

  /* increases signal size and sets to zero when it has reached its max size
      at that point, 'influences' all the shapes the signal reached */
  updateSignal() {
    if (this.signalSize > maxSigSize(this.c)) {
      this.graph.updateDist(this.name);
      this.signalSize = 0;
    } else if (this.signalSize > 0) {
      this.signalSize += 5;
    } else if (Math.random() * 30 < this.engagement) {
      this.signalSize = 1;
    }
  }

  /* distance formula */
  dist(that) {
    return this.pos.dist(that.pos);
  }

  /* 'influences' another shape by updating its attributes */
  /* todo: tweak */
  influence(that) {
    const isMoreExtreme = Math.sign(Math.abs(this.c) - Math.abs(that.c));
    const samePolarity = (that.c > 0) ^ (this.c < 0); // eslint-disable-line
    // 1 if are similar polarity, -1 if opposite
    const dir = Math.sign(samePolarity - 0.5);
    // moves closer if similar polarity, father apart if opposite
    that.pos.add(Vec.sub(this.pos, that.pos)
      .rotate(P.HALF_PI / 2)
      .normalize()
      .mult(dir * 5));

    that.c = increment(that.c, isMoreExtreme * Math.sign(this.c), 128);
  }
}
