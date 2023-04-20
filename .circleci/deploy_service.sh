#!/usr/bin/env bash

set -e

: "${GOOGLE_PROJECT_ID?Required env variable GOOGLE_PROJECT_ID}"
: "${GOOGLE_COMPUTE_REGION?Required env variable GOOGLE_COMPUTE_REGION}"
: "${CLUSTER_NAME?Required env variable CLUSTER_NAME}"
: "${CHART_NAME?Required env variable CHART_NAME}"
: "${HELM_RELEASE_NAME?Required env variable HELM_RELEASE_NAME}"
: "${GIT_REVISION?Required env variable GIT_REVISION}"

apply_prisma_migrations() {
    case "$HELM_RELEASE_NAME" in
    "ms-account" | "ms-cart" | "ms-product")
        echo -e "\033[32mApplying pending Prisma migrations from inside K8s pod"
        pod_name=$(kubectl get pods --field-selector=status.phase=Running --sort-by=.metadata.creationTimestamp -l instance="${HELM_RELEASE_NAME}" -o=name | tail -1)
        echo -e "\033[32mUsing pod $pod_name"
        kubectl exec -it "$pod_name" -- npx prisma migrate deploy --schema=./prisma/schema.prisma
        ;;
    *)
        echo -e "\033[32m${HELM_RELEASE_NAME} does not use Prisma"
        ;;
    esac
}

echo -e "\033[32mLinting helm chart"
helm lint "infra/k8s/$CHART_NAME"

# Connect to k8s cluster on GCP
gcloud container clusters get-credentials "$CLUSTER_NAME" --region "$GOOGLE_COMPUTE_REGION" --project "$GOOGLE_PROJECT_ID"

if [ "$HELM_RELEASE_NAME" = "ms-ingress" ]; then
    echo -e "\033[32mUpgrading $HELM_RELEASE_NAME"
    helm upgrade \
        --install \
        --wait \
        --timeout 10m0s \
        -f "infra/k8s/$CHART_NAME/values.yaml" \
        "$HELM_RELEASE_NAME" "infra/k8s/$CHART_NAME"
else
    echo -e "\033[32mDecrypting helm secrets..."
    gcloud kms decrypt \
        --key ms-commerce-key \
        --keyring ms-commerce-key-ring \
        --location "$GOOGLE_COMPUTE_REGION" \
        --ciphertext-file "infra/k8s/$CHART_NAME/secrets.yaml.enc" \
        --plaintext-file "infra/k8s/$CHART_NAME/secrets.yaml"

    echo -e "\033[32mUpgrading $HELM_RELEASE_NAME"
    helm upgrade \
        --install \
        --wait \
        --timeout 10m0s \
        -f "infra/k8s/$CHART_NAME/values.yaml" \
        -f "infra/k8s/$CHART_NAME/secrets.yaml" \
        --set image.tag="$GIT_REVISION" \
        "$HELM_RELEASE_NAME" "infra/k8s/$CHART_NAME"

    apply_prisma_migrations
fi
