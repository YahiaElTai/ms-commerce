# Terraform Overview

This repository contains a Terraform project for managing infrastructure provisioning on Google Cloud Platform (GCP). The infrastructure is designed to support two distinct environments: `gcp-staging-eu` and `gcp-production-eu`. Each environment is deployed within a dedicated GCP project to ensure separation of concerns and promote best practices for managing infrastructure.

## Remote State Management

Terraform's remote state is stored in a Google Cloud Storage (GCS) bucket in the `gcp-production-eu` environment. The bucket is called `ms-commerce-ops-terraform-state` which has a prefix for each environment, currently:

```
-> ms-commerce-ops-terraform-state
    -> gcp-production-eu
    -> gcp-staging-eu
```

The environment configurations are defined in `infra/terraform/environments/{env}.hcl` files, while the corresponding variables are stored in `infra/terraform/environments/{env}.tfvars` files.

## Usage Instructions

Follow the steps below to initialize and apply Terraform configurations for the desired environment:

### Initializing Terraform

Before applying any Terraform configurations, you need to initialize Terraform. To do this, run the following command, replacing `${env}` with the desired environment (`gcp-staging-eu` or `gcp-production-eu`):

```bash
    terraform init -backend-config=./environments/${env}.hcl
```

This command initializes the Terraform backend with the specified environment configuration and downloads the required provider plugins.

### Applying Terraform Configurations

To apply the Terraform configurations for the chosen environment, run the following command, again replacing `${env}` with the appropriate environment:

```bash
    terraform apply -var-file=./environments/${env}.tfvars
```

This command prompts you to confirm the changes before applying the Terraform configurations using the variables defined in the corresponding `.tfvars` file.

Please ensure you review the planned changes carefully before proceeding, as applying these configurations will affect your GCP infrastructure.

# Terraform CI/CD Pipeline

A Terraform service account is created for each Google Cloud Platform (GCP) project, which represents an individual environment. This service account enables Terraform to authenticate with the GCP project and grants it two types of access:

1. The ability to provision resources within the specific project.

   These are the required roles currently for "ms-commerce":

   - `roles/storage.admin`
   - `roles/artifactregistry.admin`
   - `roles/cloudkms.admin`
   - `roles/container.admin`
   - `roles/iam.serviceAccountAdmin`
   - `roles/resourcemanager.projectIamAdmin`
   - `roles/serviceusage.serviceUsageAdmin`
   - `roles/monitoring.admin`

2. Access to the Google Cloud Storage (GCS) bucket located in the production environment for managing its remote state.

   Using the Console and in the project where the bucket is stored, grant access to the principal (terraform service account) from each environment, this role `roles/cloudkms.admin`

Please note that before running Terraform on the CI (Continuous Integration) system, you should ensure that the Cloud Resource Manager API is enabled.

These service account should be created using the GCP Console and not via terraform locally.

Once these service accounts are created, generate a key for each of them and store it as an environment variable in CI:

- TERRAFORM_SERVICE_KEY_STAGING
- TERRAFORM_SERVICE_KEY_PROD
