#!/bin/bash

# Installing yarn
npm install -g yarn

# Install the project dependencies
yarn
bower install --allow-root

ember server
