const ContT = require('./ContT');
const Identity = require('./Identity');

const Cont = ContT(Identity);

module.exports = {
  cont: f =>
    Cont(c => Identity(f(a => Identity.run(c(a))))),
  run: (cont, k) =>
    Identity.run(Cont.run(cont, a => Identity(k(a)))),
  eval: cont =>
    Identity.run(Cont.eval(cont)),
  mapResult: (f, cont) =>
    Cont.mapResult(a => Identity(f(Identity.run(a))), cont),
  with: (f, cont) =>
    Cont.with(g => b => Identity(f(a => Identity.run(g(a)))(b)), cont),
  reset: Cont.reset,
  shift: f =>
    Cont.shift(g => a => f(Identity.run(g(a)))),
  callCC: Cont.callCC,
  try: Cont.try,
  of: Cont.of
};
