#!/bin/sh

. build/scripts/prebuild.sh
node ./node_modules/karma/bin/karma start build/config/karma.conf.js
