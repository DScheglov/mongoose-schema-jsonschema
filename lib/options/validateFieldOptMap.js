const isString = keyValue => typeof keyValue === 'string';

const isTupple = keyValue => (
  Array.isArray(keyValue)
  && keyValue.length === 2
  && keyValue.every(isString)
);

const stringOrTuple = keyValue => isString(keyValue) || isTupple(keyValue);

const validateMap = map => {
  if (Array.isArray(map) && map.every(stringOrTuple)) return map;

  if (typeof map === 'object' && map != null && Object.entries(map).every(isTupple)) return map;

  throw TypeError(
    'fieldsMapping Error: Wrong type of option value. '
      + 'Expected: { [key: string]: string } | Array<string|[string, string]>',
  );
};

module.exports = validateMap;
