import {
  Vec, randWithin, increment, maxSigSize, clr, P,
} from './utils';

/* Node class
 * Represents each individual shape
 */
export default class Node {
  constructor(i, w, h, g, user = false) {
    this.name = i;
    this.graph = g;
    // polarity coefficient
    this.c = random(-100, 100);
    this.engagement = Math.random();

    // random attributes for more visual aesthetics
    // todo: make shapes more interesting
    this.r = Math.random();
    this.pos = createVector(...[w / 3, h / 2.1].map((x) => random(-x, x)));

    this.sides = user ? user.sides : random([3, 4, 6, 24]);
    this.radii = [25, 15].map((x) => randWithin(x, x / 3));

    // initializes 'signal' (circle that comes out of shape)
    this.signalSize = 0;
    this.user = user;
  }

  /* graphic representation of shape and its 'signal'
   */
  draw(p) {
    p.push();
    p.translate(this.pos);
    this.drawSelf(p);
    this.drawSignal(p);
    p.pop();
  }

  drawSelf(p) {
    p.push();
    if (this.user) p.fill(this.user.c);
    else p.fill(...clr(this.c));
    p.noStroke();

    p.rotateX((this.r * p.frameCount) / 10);
    p.rotateY((this.r * p.frameCount) / 10);
    p.torus(...this.radii, this.sides);
    p.pop();
  }

  drawSignal(p) {
    p.push();
    if (this.user) {
      p.fill(this.user.c);
      p.stroke(this.user.c);
    } else {
      p.fill(...clr(this.c));
      p.stroke(...clr(this.c));
    }
    p.rotateX(P.PI / 2);
    p.rotateY(0);
    p.cylinder(this.signalSize, 20, 24, 1, false, false);
    p.pop();
  }

  /* updates the shapes position, and other attributes
   * (randomly or predetermined)
   */
  update(p5, params) {
    const { C } = params;
    this.updateSignal(params);
    this.c = increment(this.c, P.random(-3, 3), 128);
    this.pos.add(Vec.random2D().mult(C));
  }

  /* increases signal size and sets to zero when it has reached its max size
   * at that point, 'influences' all the shapes the signal reached
   */
  updateSignal(params) {
    const { B } = params;

    if (this.signalSize > maxSigSize(this.c, B)) {
      this.graph.updateDist(this.name, params);
      this.signalSize = 0;
    } else if (this.signalSize > 0) {
      this.signalSize += 5;
    } else if (Math.random() * 30 < this.engagement) {
      this.signalSize = 1;
    }
  }

  /* distance formula
   */
  dist(that) {
    return this.pos.dist(that.pos);
  }

  /* 'influences' another shape by updating its attributes
   */
  influence(that, params) {
    const { A } = params;

    const isMoreExtreme = Math.sign(Math.abs(this.c) - Math.abs(that.c));
    const samePolarity = (that.c > 0) ^ (this.c < 0); // eslint-disable-line
    // 1 if are similar polarity, -1 if opposite
    const dir = Math.sign(samePolarity - 0.5);
    // moves closer if similar polarity, father apart if opposite
    that.pos.add(Vec.sub(this.pos, that.pos)
      .rotate(P.HALF_PI / 2)
      .normalize()
      .mult(dir * A));

    that.c = increment(that.c, isMoreExtreme * Math.sign(this.c), 128);
  }
}
