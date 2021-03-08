import Node from './node';
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
  }

  /* when a nodes signal has been sent, this function updates the
      shapes it has reached */
  updateDist(i) {
    const n1 = this.nodes[i];
    const nodesReached = this.nodes.reduce((acc, n2, j) => {
      if ((i !== j) && (n1.dist(n2) <= maxSigSize(n1.c))) {
        n1.influence(n2);
        return acc + 1;
      }
      return acc;
    }, 0);
    n1.engagement += (nodesReached >= 3) ? 0.05 : 0;
  }

  /* continually draws and updates nodes */
  run(p) {
    this.nodes.forEach((n) => {
      n.update();
      n.draw(p);
    });
    // console.log(JSON.parse(localStorage.getItem("consoleHistory")));
  }
}
