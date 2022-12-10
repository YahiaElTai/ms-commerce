#!/usr/bin/env bash

set -e

: "${GOOGLE_PROJECT_ID?Required env variable GOOGLE_PROJECT_ID}"
: "${GOOGLE_COMPUTE_ZONE?Required env variable GOOGLE_COMPUTE_ZONE}"
: "${CLUSTER_NAME?Required env variable CLUSTER_NAME}"
: "${OPERATION?Required env variable OPERATION}"

gcloud container clusters get-credentials "$CLUSTER_NAME" --zone "$GOOGLE_COMPUTE_ZONE" --project "$GOOGLE_PROJECT_ID"

case $OPERATION in
rollout)
    kubectl rollout restart deployment "${SERVICE_NAME}-depl"
    ;;
apply)
    kubectl apply -f ./infra/k8s
    ;;
*)
    echo "OPERATION must be one of 2 values: rollout or apply"
    ;;
esac
