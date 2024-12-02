#!/bin/bash

PARENT="$(pwd)"
cd spa
yarn build
cd dist 
cp -r * "$PARENT/public"