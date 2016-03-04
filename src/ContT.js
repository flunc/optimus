//:: Monad m => Type m -> ((a -> m r) -> m r) -> ContT r m a
const ContT = M => {
  var _ContT = run => ({
    run:   run,
    map:   f => _ContT(c => run(a => c(f(a)))),
    ap:    other => _ContT(c => run(g => other.run(a => c(g(a))))),
    chain: k => _ContT(c => run(x => k(x).run(c)))
  });

  _ContT.run = (m, a) =>
    m.run(a);

  _ContT.lift = m =>
    _ContT(c => m.chain(c));

  _ContT.of = x =>
    _ContT(c => c(x));

  _ContT.eval = contT =>
    contT.run(M.of);

  _ContT.mapResult = (f, contT) =>
    _ContT(c => f(contT.run(c)));

  _ContT.with = (f, contT) =>
    _ContT(c => contT.run(f(c)));

  _ContT.callCC = f =>
    _ContT(c => f(x => _ContT(() => c(x))).run(c));

  _ContT.reset = contT =>
    _ContT.lift(_ContT.reset(contT));

  _ContT.shift = f =>
    _ContT(c => _ContT.eval(f(c)));

  _ContT.try = (c, h) =>
    _ContT.callCC(ok => _ContT.callCC(notOk => c(notOk).chain(ok)).chain(h));

  if (typeof M.liftIO === 'function') {
    _ContT.liftIO = io => _ContT.lift(M.liftIO(io));
  }

  if (typeof M.throw === 'function') {
    _ContT.throw = e => _ContT.lift(M.throw(e));
  }

  return _ContT;
};

module.exports = ContT;
