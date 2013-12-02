#!/bin/sh
SAUCE_USERNAME=jantimon SAUCE_ACCESS_KEY=ef3d2b4e-b257-40df-a4af-533a5aa2e584 node node_modules/intern/runner.js config=tests/sauceLabs/intern.config.js
genhtml lcov.info --output-directory docs/lcov