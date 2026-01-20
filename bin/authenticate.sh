#!/usr/bin/env bash

if ! gh auth status >/dev/null 2>&1; then
    gh auth login
else
    echo "GH logged in"
fi

if ! aws sts get-caller-identity >/dev/null 2>&1; then
    aws sso login
else
    echo "AWS SSO logged in"
fi
