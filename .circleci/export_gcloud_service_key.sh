#!/usr/bin/env bash

set -e

: "${ENVIRONMENT_NAME?Required env variable ENVIRONMENT_NAME}"
: "${GCLOUD_SERVICE_KEY_STAGING?Required env variable GCLOUD_SERVICE_KEY_STAGING}"
: "${GCLOUD_SERVICE_KEY_PROD?Required env variable GCLOUD_SERVICE_KEY_PROD}"

echo -e "\033[32mExporting GCLOUD_SERVICE_KEY env variable for environment $ENVIRONMENT_NAME"

GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY_STAGING"

if [ "$ENVIRONMENT_NAME" == "gcp-production-eu" ]; then
    GCLOUD_SERVICE_KEY="$GCLOUD_SERVICE_KEY_PROD"
fi

echo "GCLOUD_SERVICE_KEY=\"$GCLOUD_SERVICE_KEY\"" >>".circleci/.env.$ENVIRONMENT_NAME"