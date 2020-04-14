#!/bin/sh

. build/scripts/prebuild.sh
node ./node_modules/http-server/bin/http-server src
