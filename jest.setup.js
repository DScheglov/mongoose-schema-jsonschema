if (global.TextEncoder == null) {
  // Support for node v.10
  const util = require('util');
  global.TextEncoder = util.TextEncoder;
  global.TextDecoder = util.TextDecoder;
}
