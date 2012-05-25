#! /usr/bin/env sh

#
# Quick-save git project and deploy
#

remote_host='nelsnelson.org'
deploy_command='pushd $HOME/public_html; git fetch origin; git reset --hard origin/master;'

git add --all
git commit --amend --no-edit
git push -f origin master

ssh $remote_host $deploy_command

# All previous commands as a single command line:
# git add --all; git commit --amend --no-edit; git push -f origin master; ssh nelsnelson.org 'pushd $HOME/public_html; git fetch origin; git reset --hard origin/master;'
