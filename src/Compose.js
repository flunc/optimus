const Compose = (F, G) => {
  function _Compose(x) {
    return {
      map: f     => _Compose(x.map(y => y.map(f))),
      ap:  other => _Compose(x.map(_x => _other => _x.ap(_other)).ap(other.value)),
      value: x
    };
  }
  _Compose.of  = x => _Compose(F.of(G.of(x)));
  _Compose.run = c => c.value;
  return _Compose;
};

module.exports = Compose;

