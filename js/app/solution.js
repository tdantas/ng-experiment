function arraySum(array) {
  return array.reduce(function(acc, current) {
    if(Array.isArray(current)) return acc = acc + arraySum(current);
    if(typeof current == 'number') {
      acc = acc + current;
    }
    return acc;
  }, 0)
}