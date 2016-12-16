#!/bin/bash

if [ -f ./coveralls.sh ]; then
	echo coveralls.sh
  ./coveralls.sh
else
  NODE_ENV=test istanbul cover _mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | coveralls && rm -rf ./coverage
fi

