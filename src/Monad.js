module.exports = {
  do: block => {
    const generator = block();
    const cont = arg => {
      const res = generator.next(arg);
      return res.done ? res.value : res.value.chain(cont);
    };
    return cont();
  },
  when: (M, p, m) => p ? m : M.of(null)
};
