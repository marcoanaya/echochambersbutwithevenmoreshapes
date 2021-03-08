import p5 from 'p5';

const P = new p5(); // eslint-disable-line
const newVec = (...a) => new p5.Vector(...a);
const Vec = p5.Vector;
// converts 'polarity' coefficient to color
const c1 = newVec(200, 100, 150);
const c2 = newVec(12, 200, 200);
const clr = (c) => Vec.add(c1, Vec.sub(c2, c1).mult(P.norm(c, -100, 100))).array();

// function to calculate max signal size based on polarity coefficient
const maxSigSize = (c) => (50 + (Math.abs(c) ** 1.1));
const randWithin = (x, delta) => P.random(x - delta, x + delta);
// increases x by i, but rounds to 'cap'
const increment = (x, i, cap) => (
  (Math.abs(x + i) > Math.abs(cap))
    ? Math.sign(x + i) * cap
    : x + i
);

export {
  Vec, clr, maxSigSize, randWithin, increment, P,
};
