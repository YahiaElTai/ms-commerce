#!/usr/bin/env bash

set -e

: "${ENVIRONMENT_NAME?Required env variable ENVIRONMENT_NAME}"

echo -e "\033[32mExporting enviroment variables $ENVIRONMENT_NAME"

if [[ -n "${GCLOUD_SERVICE_KEY_ENV_NAME}" ]]; then
    GCLOUD_SERVICE_KEY_NAME="${!GCLOUD_SERVICE_KEY_ENV_NAME}"
    GCLOUD_SERVICE_KEY="${!GCLOUD_SERVICE_KEY_NAME}"

    echo "GCLOUD_SERVICE_KEY=$GCLOUD_SERVICE_KEY" >>".circleci/.env.$ENVIRONMENT_NAME"

    echo -e "\033[32mExported GCLOUD_SERVICE_KEY for enviroment $ENVIRONMENT_NAME"
fi

if [[ -n "${TERRAFORM_SERVICE_KEY_ENV_NAME}" ]]; then
    TERRAFORM_SERVICE_KEY_NAME="${!TERRAFORM_SERVICE_KEY_ENV_NAME}"
    TERRAFORM_SERVICE_KEY="${!TERRAFORM_SERVICE_KEY_NAME}"
    echo "$TERRAFORM_SERVICE_KEY" >>"$HOME"/terraform-service-key.json

    echo "GOOGLE_APPLICATION_CREDENTIALS=\"$HOME/terraform-service-key.json\"" >>".circleci/.env.$ENVIRONMENT_NAME"

    echo -e "\033[32mExported GOOGLE_APPLICATION_CREDENTIALS for enviroment $ENVIRONMENT_NAME"
fi
