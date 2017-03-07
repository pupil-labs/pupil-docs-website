#!/bin/bash
set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  echo -e "Host ${DEPLOY_DOMAIN}\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
  openssl aes-256-cbc -K $encrypted_8e61a18b00c8_key -iv $encrypted_8e61a18b00c8_iv -in docs_deploy_rsa.enc -out /tmp/docs_deploy_rsa -d
fi