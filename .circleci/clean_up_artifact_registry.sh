#!/usr/bin/env bash

set -e

: "${GOOGLE_PROJECT_ID?Required env variable GOOGLE_PROJECT_ID}"
: "${REGISTRY_URL?Required env variable REGISTRY_URL}"
: "${REPO_NAME?Required env variable REPO_NAME}"

REPO="$REGISTRY_URL/$GOOGLE_PROJECT_ID/$REPO_NAME"

echo -e "\033[32mCleaning up artifact registry old images"

docker run -v "$HOME/.config/gcloud:/.config/gcloud" -it europe-docker.pkg.dev/gcr-cleaner/gcr-cleaner/gcr-cleaner-cli -repo "$REPO"
