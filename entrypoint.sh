#!/bin/bash

# Install the project dependencies
bower install --allow-root & wait
yarn & wait

ember server
