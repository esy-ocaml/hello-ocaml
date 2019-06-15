#!/bin/bash

set -e
set -o pipefail
set -x

ESY_VERSION=latest

npmInstallEsy () {
  npm install -g "esy@${ESY_VERSION}"
}

esyInstall () {
  esy install
}

esyBuild () {
  esy build
}
