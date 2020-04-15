#!/bin/bash

if [ -f ./coveralls.sh ]; then
	echo coveralls.sh
  ./coveralls.sh
else
  jest && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
fi
