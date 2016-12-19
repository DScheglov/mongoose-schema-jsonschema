#!/bin/bash

if [ -f ./coveralls.sh ]; then
	echo coveralls.sh
  ./coveralls.sh
else
  istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
fi
