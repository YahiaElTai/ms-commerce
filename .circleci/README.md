### CircleCI setup

1.  Connect Github repo to CircleCI.

2.  Add required env variables:

    - `GCLOUD_SERVICE_KEY`: See below for setup
    - `GOOGLE_COMPUTE_ZONE`
    - `GOOGLE_COMPUTE_REGION`
    - `GOOGLE_PROJECT_ID`
    - `CLUSTER_NAME`: Kubernetes cluster name
    - `REGISTRY_URL`: Artifact Registry URL
    - `REPO_NAME`: Artifact Registry repository name

3.  Add `GCLOUD_SERVICE_KEY` env variable to authenticate CI with Artifact Registry & Kubernetes Engine

    1. Create service account and add the required roles to it.

       ```bash

       # Create service account
       gcloud iam service-accounts create [SA_NAME] --display-name=[DISPLAY_NAME]

       # Add required roles to sevice account
       gcloud projects add-iam-policy-binding [PROJECT_ID] \
       --member="serviceAccount:[SA_NAME]@[PROJECT_ID].iam.gserviceaccount.com" \
       --role=roles/artifactregistry.admin

       gcloud projects add-iam-policy-binding [PROJECT_ID] \
       --member="serviceAccount:[SA_NAME]@[PROJECT_ID].iam.gserviceaccount.com" \
       --role=roles/container.admin

       gcloud projects add-iam-policy-binding [PROJECT_ID] \
       --member="serviceAccount:[SA_NAME]@[PROJECT_ID].iam.gserviceaccount.com" \
       --role=roles/cloudkms.cryptoKeyDecrypter
       ```

    2. Create key file in JSON format and download it.

    3. Create env variable in CircleCI GCLOUD_SERVICE_KEY with the content of the file downloaded as is.
