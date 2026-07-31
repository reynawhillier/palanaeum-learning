#!/bin/sh
set -e

npm install

node ace migration:run

exec npm run dev
