#!/bin/bash

set -e
set -o pipefail

npm uninstall @hakimamarullah/commonbundle-nestjs
npm i ../commonbundle/hakimamarullah-commonbundle-nestjs-1.0.0.tgz