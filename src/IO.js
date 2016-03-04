const IO = action => ({
  map: f => IO(() => f(action())),
  ap: other => other.map(action()),
  chain: k => k(action()),
  run: action
});

IO.of = a => IO(() => a);

module.exports = IO;
