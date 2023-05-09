# Overview

This repository contains a Terraform project for managing infrastructure provisioning on Google Cloud Platform (GCP). The infrastructure is designed to support two distinct environments: `staging` and `production`. Each environment is deployed within a dedicated GCP project to ensure separation of concerns and promote best practices for managing infrastructure.

## Remote State Management

Terraform's remote state is stored in separate Google Cloud Storage (GCS) buckets for each environment (`staging` and `production`). This approach ensures isolation and security of state files, preventing unauthorized access or accidental changes to the infrastructure.

The environment configurations are defined in `./environments/{env}.hcl` files, while the corresponding variables are stored in `./environments/{env}.tfvars` files.

## Usage Instructions

Follow the steps below to initialize and apply Terraform configurations for the desired environment:

### Initializing Terraform

Before applying any Terraform configurations, you need to initialize Terraform. To do this, run the following command, replacing `${env}` with the desired environment (`staging` or `production`):

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
