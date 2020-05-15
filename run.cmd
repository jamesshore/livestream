@echo off

call build/scripts/prebuild.cmd
node src/score.js %*
