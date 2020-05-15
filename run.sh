#!/bin/sh

. build/scripts/prebuild.sh
node src/score.js $*
