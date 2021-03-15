import P5 from 'p5';

P5.disableFriendlyErrors = true;

const P = new P5();
const Vec = P5.Vector;

// converts 'polarity' coefficient to color
const c1 = new P5.Vector(200, 100, 150);
const c2 = new P5.Vector(12, 200, 200);
const clr = (c) => Vec.add(c1, Vec.sub(c2, c1).mult(P.norm(c, -100, 100))).array();

const transformC = (c, method) => {
  switch (method) {
    case 1: return 75;
    case 2: return (c + 100) / 2;
    case 3: return (-c + 100) / 2;
    default: return c;
  }
};

// function to calculate max signal size based on polarity coefficient
const maxSigSize = (c, method) => 50 + Math.abs(transformC(c, method)) ** 1.1;

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
