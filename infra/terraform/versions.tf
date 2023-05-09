terraform {
  required_version = "1.0.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.63.1"
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