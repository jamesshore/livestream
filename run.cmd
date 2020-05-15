@echo off

call build/scripts/prebuild.cmd
node src/run.js %*
