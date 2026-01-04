#!/usr/bin/env bash

INSTALL_NODE_VERSION="24"

curl -fsSL "https://deb.nodesource.com/setup_${INSTALL_NODE_VERSION}.x" | bash

apt install awscli gh nodejs -y
