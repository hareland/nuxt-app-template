#!/bin/sh
set -eu

IS_MONOREPO=${IS_MONOREPO:-false}
APP_ROOT=${APP_ROOT:-apps/web}

if [ "$IS_MONOREPO" = "true" ]; then
  BASE="/repo/${APP_ROOT}"
else
  BASE="/repo"
fi

mkdir -p "${BASE}/.data/db"
exec node "${BASE}/.output/server/index.mjs"
