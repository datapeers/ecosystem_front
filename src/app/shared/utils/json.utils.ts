/**
   * sorts the keys of the given object as parameter
   * @returns a new object with the keys sorted in the specified order
   */
const sortObjectKeys = (object: any | any[], order: 1 | -1 = 1): any => {
  if (Array.isArray(object)) {
    return object.map((innerObject) => sortObjectKeys(innerObject));
  }
  if(typeof object !== 'object') {
    return object;
  }
  return Object.keys(object)
    .sort(function (a, b) {
      if (a > b) {
        return order;
      }
      if (b > a) {
        return -order;
      }
      return 0;
    })
    .reduce((prev, curr) => {
      if (typeof object[curr] === 'object' && object[curr] !== null) {
        prev[curr] = sortObjectKeys(object[curr], order);
      } else {
        prev[curr] = object[curr];
      }
      return prev;
    }, {});
}

export const jsonUtils = {
  sortObjectKeys
};