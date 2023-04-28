# This terraform file is applied only locally as of now and not part of any CI/CD pipeline
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.63.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.20.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "2.9.0"
    }
  }
}

#  Local variables
locals {
  # General GCP values
  project_id = "ms-commerce-round-2-key"
  region     = "europe-west1"
  zone       = "europe-west1-b"

  # required GCP services to be enabled
  enabled_gcp_services = [
    "artifactregistry.googleapis.com",
    "container.googleapis.com",
    "sqladmin.googleapis.com",
    "cloudkms.googleapis.com"
  ]

  # GKE cluster 
  k8s_cluster_name = "ms-commerce"
  k8s_namespace    = "default"

  # Artifact Registry
  repository_name = "ms-commerce"

  # CircleCI service account to authenticate for the roles mentioned below
  ci_service_account_account_id   = "circleci-sa"
  ci_service_account_display_name = "Circleci SA"
  ci_service_account_roles = [
    "roles/artifactregistry.repoAdmin",
    "roles/container.developer",
    "roles/cloudkms.cryptoKeyDecrypter",
  ]

  # KMS key ring and key values
  keyring_name = "ms-commerce-key-ring"
  key_name     = "ms-commerce-key"
}

# List of providers required
provider "google" {
  project = local.project_id
  region  = local.region
  zone    = local.zone
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

# Enable required services
resource "google_project_service" "enabled_services" {
  for_each = toset(local.enabled_gcp_services)

  service            = each.value
  disable_on_destroy = false
}

# Create Artifact Registry repository
resource "google_artifact_registry_repository" "ms_commerce_repository" {
  repository_id = local.repository_name
  location      = local.region
  format        = "DOCKER"
}

# Create CI service account to authenticate to Artifact Registry, GKE and KMS
resource "google_service_account" "ci_service_account" {
  account_id   = local.ci_service_account_account_id
  display_name = local.ci_service_account_display_name
}

# Add needed roles for CI service account
resource "google_project_iam_member" "ci_sa_roles" {
  for_each = toset(local.ci_service_account_roles)

  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.ci_service_account.email}"
}

# Create Autopilot GKE cluster
resource "google_container_cluster" "ms-commerce-cluster" {
  name     = local.k8s_cluster_name
  project  = local.project_id
  location = local.region
  ip_allocation_policy {}
  enable_autopilot = true
}

#  Install ingress_nginx controller chart via helm
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  create_namespace = true
  namespace        = "ingress-nginx"
}

# Create key ring and key for KMS encryption for helm secrets
resource "google_kms_key_ring" "ms-commerce-key-ring" {
  name     = local.keyring_name
  location = local.region
}

resource "google_kms_crypto_key" "ms-commerce-key" {
  name     = local.key_name
  key_ring = "projects/${local.project_id}/locations/${local.region}/keyRings/${local.keyring_name}"
}



