const ContT = require('./ContT');
const Either = require('./Either');
const ExceptT = require('./ExceptT');
const IO = require('./IO');

const ContIO = ContT(IO);

//:: Future e a = ExceptT e ContT IO () a
const _Future = ExceptT(ContIO);

const Future = f => _Future(ContIO(k => f(rej => k(Either.Left(rej)), res => k(Either.Right(res)))));
Future.of = _Future.of;
Future.throw = _Future.throw;
Future.catch = _Future.catch;
Future.fork = (future, onSuccess, onError) =>
  ContIO.run(_Future.run(future), e => e.either(onError, onSuccess));

module.exports = Future;
