const Cont = require('../src/Cont');
const Monad = require('../src/Monad');


console.log('-- WHATS YOUR NAME --');

// Demonstrates the use of `Cont.callCC` to abort a chain of monadic actions
const whatsYourName = name => Cont.eval(Monad.do(function*() {

  const validate = (name, exit) =>
    Monad.when(Cont,
               name.length === 0,
               exit('You forgot to tell me your name!'));

  const response = yield Cont.callCC(exit => Monad.do(function*() {
    yield validate(name, exit);
    return Cont.of('Welcome, ' + name + '!');
  }));

  return Cont.of(response);
}));

console.log(whatsYourName(''));             // You forgot to tell me your name!
console.log(whatsYourName('Jimmy Giggle')); // Welcome, Jimmy Giggle!

//---------------------------------------------------------------------------//

console.log('\n-- NUMBER WANG --');

// Demonstrates the use of `Cont.try` for modeling exceptions
const numberWang = n => Cont.try(throwErr => Monad.do(function*(){

  yield Monad.when(Cont, n === 0, throwErr('division by zero'));

  const n1 = 42 / n;
  const n2 = n1 - 42;

  yield Monad.when(Cont, n2 < 0, throwErr('negative sqrt'));

  const n3 = Math.sqrt(n2);

  return Cont.of("That's number wang: " + n3);
}), msg => Cont.of('Failed: ' + msg));

console.log(Cont.eval(numberWang(0)));  // Failed: division by zero
console.log(Cont.eval(numberWang(42))); // Failed: negative sqrt
console.log(Cont.eval(numberWang(1)));  // That's number wang: 0

//---------------------------------------------------------------------------//

console.log('\n-- EARLY TERMINATING PRODUCT --');

// Demonstrates the use of `Cont.callCC` for early termination
const product = xs => Cont.callCC(exit => {
  const loop = _xs => (_xs.length === 0) ? Cont.of(1) :
                      (_xs[0]     === 0) ? exit(0)    :
                      loop(_xs.slice(1)).chain(n => Cont.of(n * _xs[0]));
  return loop(xs);
});

console.log(Cont.eval(product([1, 0, 3, 4]))); // 0
console.log(Cont.eval(product([1, 2, 3, 4]))); // 24

//---------------------------------------------------------------------------//

console.log('\n-- NON-DETERMINISM --');

// Demonstrates non-determinism by calling the continuation multiple times
const each = xs => Cont.cont(k =>
  Array.prototype.concat.apply([], xs.map(k)));

console.log(Cont.eval(
  each(['1', '2']).chain(n1 =>
  each(['a', 'b']).chain(n2 =>
  each(['x', 'y']).chain(n3 =>
  Cont.of(n1 + n2 + n3))))));
// [ '1ax', '1ay', '1bx', '1by', '2ax', '2ay', '2bx', '2by' ]
