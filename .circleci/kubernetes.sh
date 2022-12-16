#!/usr/bin/env bash

set -e

: "${GOOGLE_PROJECT_ID?Required env variable GOOGLE_PROJECT_ID}"
: "${GOOGLE_COMPUTE_REGION?Required env variable GOOGLE_COMPUTE_REGION}"
: "${CLUSTER_NAME?Required env variable CLUSTER_NAME}"
: "${OPERATION?Required env variable OPERATION}"

apply_prisma_migrations() {
    if [ "$SERVICE_NAME" == "auth" ] || [ "$SERVICE_NAME" == "cart" ]; then
        echo "Applying pending Prisma migrations from inside K8s pod"

        # Get the name of one of the settings pods running
        pod_name=$(kubectl get pods --field-selector=status.phase=Running --sort-by=.metadata.creationTimestamp -l app="${SERVICE_NAME}" -o=name | tail -1)

        echo "Using pod $pod_name"

        # Trigger a migration deployment using the running pod (to ensure the DB connection works)
        kubectl exec -it "$pod_name" -- \
            npx prisma migrate deploy --schema=./prisma/schema.prisma

    else
        echo "${SERVICE_NAME} does not use Prisma"
    fi
}

gcloud container clusters get-credentials "$CLUSTER_NAME" --region "$GOOGLE_COMPUTE_REGION" --project "$GOOGLE_PROJECT_ID"

case $OPERATION in
rollout)
    apply_prisma_migrations
    kubectl rollout restart deployment "${SERVICE_NAME}-depl"
    ;;
apply)
    kubectl apply -f ./infra/k8s
    ;;
*)
    echo "OPERATION must be one of 2 values: rollout or apply"
    ;;
esac
