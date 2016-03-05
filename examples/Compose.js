const Compose = require('../src/Compose');
const Either  = require('../src/Either');

const Left  = Either.Left;
const Right = Either.Right;

// Represents a nested Either type, e.g. Either a (Either b c)
const EE = Compose(Either, Either);

// A helper function for logging the nested value of an EE
const logEE = ee => EE.run(ee).either(
    a => console.log('Outer Left:', a),
    e => e.either(b => console.log('Inner Left:', b),
                  c => console.log('Value:', c)));

// An example function for adding the values of two EEs together
const addEE = (a, b) =>
  a.map(_a => _b => _a + _b).ap(b);

// The `Compose` data constructor (`EE` here) receives a nested instance
logEE(addEE(EE(Right(Right(4))),
            EE(Right(Right(5))))); // Value: 9

// Values can be lifted into nested instance via `of`
logEE(addEE(EE.of(4),
            EE.of(5))); // Value: 9

// Compose will exhibit the behavour of `map` and `ap` of the underlying
// nested types
logEE(addEE(EE(Left('boo')),
            EE.of(5))); // Outer Left: boo

logEE(addEE(EE(Right(Left('gah'))),
            EE.of(5))); // Inner Left: gah

