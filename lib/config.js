const [
  FIELD_OPTIONS_MAPPING,
  fieldOptionsMapping,
  defFielddOptionsMapping,
] = require('./options/fieldOptionsMapping');

const [
  FORCE_REBUILD,
  defForceRebuild,
] = require('./options/forceRebuild');

const mappers = new Map([
  [FIELD_OPTIONS_MAPPING, fieldOptionsMapping],
]);

const options = new Map([
  [FIELD_OPTIONS_MAPPING, defFielddOptionsMapping],
  [FORCE_REBUILD, defForceRebuild],
]);

const setOption = optionsPatch => option => {
  const valueMapper = mappers.get(option);
  const value = optionsPatch[option];
  options.set(
    option,
    typeof valueMapper === 'function' ? valueMapper(value) : value,
  );
};

const config = optionsPatch => Object
  .keys(optionsPatch)
  .forEach(setOption(optionsPatch));

config.get = option => options.get(option);

module.exports = config;
