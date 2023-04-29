# Project Overview

This project uses Terraform to manage infrastructure provisioning on Google Cloud Platform (GCP). The infrastructure is designed to support two separate environments: `staging` and `production`. Each environment has its own dedicated GCP project.

## Terraform Workspaces

Terraform workspaces are used to separate the state and management of each environment. This allows for better isolation and control when working with multiple environments.

By leveraging workspaces, a single Terraform configuration can be used to manage the infrastructure for both the staging and production environments. This promotes reusability and reduces the potential for configuration drift between environments.

## Directory Structure

The project is organized as follows:

- `main.tf`: The primary Terraform configuration file containing the infrastructure resources and configuration.
- `variables.tf`: Contains the Terraform input variables used in the `main.tf` file.
- `terraform.production.tfvars`: Contains the variable values specific to the production environment.
- `terraform.staging.tfvars`: Contains the variable values specific to the staging environment.

## Provisiong

To provision the staging environment, execute the following commands:

    ```
    terraform workspace select staging

    terraform apply -var-file=terraform.staging.tfvars
    ```

To provision the production environment, execute the following commands:

    ```
    terraform workspace select production

    terraform apply -var-file=terraform.production.tfvars
    ```

When updating infrastructure, remember to switch to the correct workspace first and use the correct `.tfvars` file.
