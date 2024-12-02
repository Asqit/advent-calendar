#!/bin/bash
cd spa
yarn build
cd dist 
cp -r * ../../public