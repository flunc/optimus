const Either = require('./Either');

const ExceptT = M => {
  const _ExceptT = me => ({
    inner: me,
    map: f => _ExceptT(me.map(e => e.map(f))),
    ap: other =>
      _ExceptT(me.chain(f =>
        f.either(e => me,
                 k => other.inner.chain(v =>
                   v.either(e => other.inner,
                            x => M.of(Either.Right(k(x)))))))),
    chain: k => _ExceptT(me.chain(e => e.either(_ => me, x => k(x).inner)))
  });

  _ExceptT.run = e => e.inner;

  _ExceptT.throw = e =>
    _ExceptT(M.of(Either.Left(e)));

  _ExceptT.catch = (m, h) =>
    _ExceptT(m.inner.chain(e => e.either(l => h(l).inner, r => m.inner)));

  _ExceptT.transform = (f, e) =>
    _ExceptT(f(e.inner));

  _ExceptT.of = a =>
    _ExceptT(M.of(Either.Right(a)));

  _ExceptT.lift = m =>
    _ExceptT(m.chain(a => M.of(Either.Right(a))));

  if (typeof M.liftIO === 'function') {
    _ExceptT.liftIO = io => _ExceptT.lift(M.liftIO(io));
  }

  if (typeof M.callCC === 'function') {
    _ExceptT.callCC = f => _ExceptT(M.callCC(c => f(a => _ExceptT(c(Either.Right(a)))).inner))
  }

  return _ExceptT;
};

module.exports = ExceptT;
