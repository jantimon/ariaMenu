#!/bin/sh
SAUCE_USERNAME=ariaMenu SAUCE_ACCESS_KEY=ecd461a4-d549-409e-a7da-40533e8fba93 node node_modules/intern/runner.js config=tests/sauceLabs/intern.config.js
genhtml lcov.info --output-directory docs/lcov