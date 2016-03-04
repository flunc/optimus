const Left = a => {
  const self = {
    map: f => self,
    ap: other => self,
    chain: k => self,
    either: (l, r) => l(a)
  };
  return self;
};

const Right = b => ({
  map: f => Right(f(b)),
  ap: other => other.map(b),
  chain: f => f(b),
  either: (l, r) => r(b)
});

module.exports = {
  Left: Left,
  Right: Right,
  of: Right
};
