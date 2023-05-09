#!/bin/sh

set -e

: "${ENVIRONMENT_NAME?Required env variable ENVIRONMENT_NAME}"
# : "${GCLOUD_SERVICE_KEY_STAGING?Required env variable GCLOUD_SERVICE_KEY_STAGING}"
# : "${GCLOUD_SERVICE_KEY_PROD?Required env variable GCLOUD_SERVICE_KEY_PROD}"

# echo -e "\033[32mExporting GCLOUD_SERVICE_KEY env variable for environment $ENVIRONMENT_NAME"

# GCLOUD_SERVICE_KEY="$(printf %q "$GCLOUD_SERVICE_KEY_STAGING")"

# if [ "$ENVIRONMENT_NAME" == "gcp-production-eu" ]; then
#     GCLOUD_SERVICE_KEY="$(printf %q "$GCLOUD_SERVICE_KEY_PROD")"
# fi

# echo "GCLOUD_SERVICE_KEY=$GCLOUD_SERVICE_KEY" >>".circleci/.env.$ENVIRONMENT_NAME"

echo "$TERRAFORM_GCP_STAGING_KEY" >>"$HOME"/terraform-service-key.json

echo "GOOGLE_APPLICATION_CREDENTIALS=\"$HOME/terraform-service-key.json\"" >>".circleci/.env.$ENVIRONMENT_NAME"

cat "$GOOGLE_APPLICATION_CREDENTIALS"
