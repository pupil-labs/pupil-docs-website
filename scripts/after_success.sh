#!/bin/bash
set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    echo 'Setting up deployment keys......'
    eval "$(ssh-agent -s)"
    chmod 600 /tmp/docs_deploy_rsa
    ssh-add /tmp/docs_deploy_rsa
    echo 'Pushing to server...'
    rsync -azhv --exclude "*.DS_Store" --exclude "*.git" --exclude "*.gitignore" public/ $DEPLOY_RSYNC
fi