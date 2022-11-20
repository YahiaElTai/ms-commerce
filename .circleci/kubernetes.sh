#!/usr/bin/env bash

set -e

gcloud container clusters get-credentials $CLUSTER_NAME --zone $GOOGLE_COMPUTE_ZONE --project $GOOGLE_PROJECT_ID

if [ "$OPERATION" == "rollout" ]; then 
        kubectl rollout restart deployment $SERVICE_NAME-depl
        elif [ "$OPERATION" == "apply" ]; then
            kubectl apply -f ../infra/k8s
fi