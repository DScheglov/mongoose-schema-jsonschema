const { compose, hasProperty, idX } = require('../helpers');

describe('compose', () => {
  it('should return an idX function', () => {
    expect(compose()).toBe(idX);
  });

  it('should return the same function if only one funtion passed', () => {
    const fn = () => {};
    expect(compose(fn)).toBe(fn);
  });

  it('should compose 2 functions', () => {
    const sum = (a, b) => a + b;
    const double = x => 2 * x;
    const doubleSum = compose(double, sum);

    expect(doubleSum(1, 2)).toBe(6);
  });

  it('should compose 3 functions', () => {
    const argsList = (...args) => args;
    const packToArray = value => [value];
    const packToObj = field => value => ({ [field]: value });

    const packArgsList = compose(packToArray, packToObj('args'), argsList);

    expect(
      packArgsList(1, 2, 3),
    ).toEqual([{ args: [1, 2, 3] }]);
  });
});

describe('hasProperty', () => {
  it('should return true if field is in the object', () => {
    expect(
      hasProperty({ field: 1 }, 'field'),
    ).toBe(true);
  });

  it('should return false if field is not in the object', () => {
    expect(
      hasProperty({ field: 1 }, 'field2'),
    ).toBe(false);
  });

  it('should not consider prototype', () => {
    const obj = Object.create({ protoProp: true });
    expect(obj.protoProp).toBe(true);
    expect(hasProperty(obj, 'protoProp')).toBe(false);
  });
});
