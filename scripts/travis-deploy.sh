#!/bin/bash
# Deploy to staging/production on master/release merges (not PRs)

set -e

# Don't deploy on PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  # Deploy to staging on a merge to master
  ember deploy --environment staging
  list=`ember deploy:list --environment staging`
  rev=`echo $list | sed -n "s/.*revisions: | [=>[:space:]]*\([^[:space:]]*\).*/\1/p"`
  printf "Activating $rev \n"
  ember deploy:activate --revision $rev --environment staging

elif [ "$TRAVIS_TAG" != "false" ]; then
  # Deploy to production on a merge to release
  ember deploy --environment production
  list=`ember deploy:list --environment production`
  rev=`echo $list | sed -n "s/.*revisions: | [=>[:space:]]*\([^[:space:]]*\).*/\1/p"`
  printf "Activating $rev \n"
  ember deploy:activate --revision $rev --environment production
fi