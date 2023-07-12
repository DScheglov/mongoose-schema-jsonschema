#!/bin/bash

if [[ ! -z "${COVERALLS_REPO_TOKEN}" ]]; then
  cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && echo "Coverage sent"
else
  echo "No Coveralls Token assigned"
fi
