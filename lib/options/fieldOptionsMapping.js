const { compose, hasProperty } = require('../helpers');

const FIELDS_MAPPING = 'fieldOptionsMapping';

const ensureKeyValue = keyValue => (
  Array.isArray(keyValue)
    ? keyValue
    : [keyValue, keyValue]
);

const normalizeMap = map => (
  Array.isArray(map)
    ? map.map(ensureKeyValue)
    : Object.entries(map)
);


const assign = (dest, src) => (dest != null ? Object.assign(dest, src) : src);

const processFields = mapping => typeDef => mapping.reduce(
  (fields, [mField, sField]) => (
    hasProperty(typeDef, mField)
      ? assign(fields, { [sField]: typeDef[mField] })
      : fields
  ),
  null,
);

module.exports = [
  FIELDS_MAPPING, // name of the option
  process.env.NODE_ENV === 'production'
    ? compose(processFields, normalizeMap)
    : compose(processFields, normalizeMap, require('./validateFieldOptMap')),
  () => null, // default value of the option
];
