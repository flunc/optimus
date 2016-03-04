const Identity = x => ({
  map:   f => Identity(f(x)),
  ap:    other => other.map(x),
  chain: k => k(x),
  value: x
});

Identity.of = Identity;

Identity.run = id =>
  id.value;

module.exports = Identity;
