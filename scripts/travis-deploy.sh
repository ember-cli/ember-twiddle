#!/bin/bash
# Deploy to staging/production on master/release merges (not PRs)

set -e

# Don't deploy on PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  # Deploy to staging on a merge to master
  ember deploy --environment staging && ember deploy:activate --environment staging --revision=`ember deploy:list --environment staging | grep '1)' | awk {'print $2'}`

elif [ "$TRAVIS_TAG" != "false" ]; then
  # Deploy to production on a tag
  ember deploy --environment production && ember deploy:activate --environment production --revision=`ember deploy:list --environment production | grep '1)' | awk {'print $2'}`
fi