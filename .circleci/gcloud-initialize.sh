#!/usr/bin/env bash

set -e
# Add checks for env variables from orb using sh

# save gcloud service key into a json file
echo "$GCLOUD_SERVICE_KEY" >"${HOME}"/gcloud-service-key.json

# Initialize gcloud CLI

gcloud --quiet config set core/disable_usage_reporting true

gcloud --quiet config set component_manager/disable_update_check true

gcloud auth activate-service-account --key-file="${HOME}"/gcloud-service-key.json

gcloud --quiet config set project "$GOOGLE_PROJECT_ID"

if [[ -n $GOOGLE_COMPUTE_ZONE ]]; then
    gcloud --quiet config set compute/zone "$GOOGLE_COMPUTE_ZONE"
fi

if [[ -n $GOOGLE_COMPUTE_REGION ]]; then
    gcloud --quiet config set compute/region "$GOOGLE_COMPUTE_REGION"
fi
