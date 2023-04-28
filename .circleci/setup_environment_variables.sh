#!/usr/bin/env bash

set -e

: "${ENVIRONMENT_NAME?Required env variable ENVIRONMENT_NAME}"

echo -e "\033[32mSourcing environment variables..."
# shellcheck disable=SC1090
source ".circleci/.env.$ENVIRONMENT_NAME"

echo -e "\033[32mExporting GCLOUD_SERVICE_KEY env variable for environment $ENVIRONMENT_NAME"

if [ "$ENVIRONMENT_NAME" == "gcp-production-eu" ]; then
    GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY_PROD"
else
    GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY_STAGING"
fi

export GCLOUD_SERVICE_KEY
