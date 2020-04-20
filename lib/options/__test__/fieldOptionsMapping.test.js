const [OPTION_NAME, optionParse, optionDefaultValue] = require('../fieldOptionsMapping');

describe('option fieldOptionsMapping', () => {
  test('option name should be specified', () => {
    expect(typeof OPTION_NAME).toBe('string');
    expect(OPTION_NAME).not.toBe('');
  });

  test('optionsDefaultValue should be a function', () => {
    expect(typeof optionDefaultValue).toBe('function');
  });

  test('optionParse should parse an object', () => {
    const fieldsMapper = optionParse({ x: 'x-x', y: 'x-y' });
    expect(fieldsMapper({ x: 1, y: 2, z: 3 })).toEqual({
      'x-x': 1,
      'x-y': 2,
    });
  });

  test('optionsParse should parse an array of strings', () => {
    const fieldsMapper = optionParse(['x', 'y']);
    expect(fieldsMapper({ x: 1, y: 2, z: 3 })).toEqual({
      x: 1,
      y: 2,
    });
  });

  test('optionsParse should parse an array of strings and not map field if it doesn\'t present in the src', () => {
    const fieldsMapper = optionParse(['x', 'y']);
    expect(fieldsMapper({ x: 1, z: 3 })).toEqual({
      x: 1,
    });
  });

  test('optionsParse should parse an array of string-tuples', () => {
    const fieldsMapper = optionParse([
      ['x', 'x-x'],
      ['y', 'x-y'],
    ]);
    expect(fieldsMapper({ x: 1, y: 2, z: 3 })).toEqual({
      'x-x': 1,
      'x-y': 2,
    });
  });

  test('should raise an error if specified not an object or an array', () => {
    const errorMessage = (
      'fieldsMapping Error: Wrong type of option value. '
      + 'Expected: { [key: string]: string } | Array<string|[string, string]>'
    );

    expect(
      () => optionParse(),
    ).toThrow(errorMessage);

    expect(
      () => optionParse(null),
    ).toThrow(errorMessage);

    expect(
      () => optionParse(1),
    ).toThrow(errorMessage);

    expect(
      () => optionParse('string'),
    ).toThrow(errorMessage);

    expect(
      () => optionParse(true),
    ).toThrow(errorMessage);
  });
});
