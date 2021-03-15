import Node from './Node';
import { maxSigSize } from './utils';

/* Graph class
  * Represents a collection of shapes and updates based on their interactions
  */
export default class Graph {
  constructor(n, w, h) {
    this.n = n;
    this.nodes = Array(n)
      .fill()
      .map((_, i) => new Node(i, w, h, this));
    this.hasUser = false;
  }

  /* when a nodes signal has been sent, this function updates the
      shapes it has reached */
  updateDist(i, params) {
    const { B } = params;
    const n1 = this.nodes[i];
    const nodesReached = this.nodes.reduce((acc, n2, j) => {
      if ((i !== j) && (n1.dist(n2) <= maxSigSize(n1.c, B))) {
        n1.influence(n2, params);
        return acc + 1;
      }
      return acc;
    }, 0);
    n1.engagement += (nodesReached >= 3) ? 0.05 : 0;
  }

  /* continually draws and updates nodes */
  run(p5, params) {
    this.nodes.forEach((n) => {
      n.update(p5, params);
      n.draw(p5);
    });
  }

  addUser(w, h, shape) {
    if (this.user) {
      if (this.user.c !== shape.c || this.user.sides !== shape.sides) {
        this.nodes[this.nodes.length - 1] = new Node(this.nodes.length - 1, w, h, this, shape);
        this.user = shape;
      }
    } else {
      this.nodes.push(new Node(this.nodes.length, w, h, this, shape));
      this.user = shape;
    }
  }
}
