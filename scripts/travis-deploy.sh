#!/bin/bash
# Deploy to staging/production on master/release merges (not PRs)

set -e

# Don't deploy on PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  # Deploy to staging on a merge to master
  ember deploy staging --verbose --activate

elif [ -n "$TRAVIS_TAG" ]; then
  # Deploy to production on a tag
  ember deploy production --verbose --activate
fi
