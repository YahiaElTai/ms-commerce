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
  # required GCP services to be enabled
  enabled_gcp_services = [
    "artifactregistry.googleapis.com",
    "container.googleapis.com",
    "cloudkms.googleapis.com"
  ]

  # CircleCI service account to authenticate for the roles mentioned below
  ci_service_account_account_id   = "circleci-sa"
  ci_service_account_display_name = "Circleci SA"
  ci_service_account_roles = [
    "roles/artifactregistry.repoAdmin",
    "roles/container.developer",
    "roles/cloudkms.cryptoKeyDecrypter",
  ]

  # 3 pod monitoring for the 3 services
  pod_monitoring = [
    {
      name      = "prom-ms-account"
      app_label = "account"
    },
    {
      name      = "prom-ms-product"
      app_label = "product"
    },
    {
      name      = "prom-ms-cart"
      app_label = "cart"
    }
  ]

  # Values for uptime checks to be created below
  uptime_checks = [
    {
      display_name              = "Account service uptime check"
      path                      = "/api/account/health"
      alert_policy_display_name = "Account service health check uptime failure"
    },
    {
      display_name              = "Product service uptime check"
      path                      = "/api/products/health"
      alert_policy_display_name = "Product service health check uptime failure"
    },
    {
      display_name              = "Cart service uptime check"
      path                      = "/api/carts/health"
      alert_policy_display_name = "Cart service health check uptime failure"
    }
  ]


}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
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
  repository_id = var.repository_name
  location      = var.region
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

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.ci_service_account.email}"
}

# Create Autopilot GKE cluster
resource "google_container_cluster" "ms-commerce-cluster" {
  name     = var.k8s_cluster_name
  project  = var.project_id
  location = var.region
  ip_allocation_policy {}
  enable_autopilot = true
}

#  Install ingress_nginx controller chart via helm
#  Ensure `config_path = "~/.kube/config"` contains access to the cluster created above
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  create_namespace = true
  namespace        = "ingress-nginx"
}

# Create key ring and key for KMS encryption for helm secrets
resource "google_kms_key_ring" "ms-commerce-key-ring" {
  name     = var.keyring_name
  location = var.region
}

resource "google_kms_crypto_key" "ms-commerce-key" {
  name     = var.key_name
  key_ring = "projects/${var.project_id}/locations/${var.region}/keyRings/${var.keyring_name}"
}

# Create PodMonitoring CR for GCP managed Prometheus service
resource "kubernetes_manifest" "pod_monitoring" {
  for_each = { for item in local.pod_monitoring : item.name => item }

  manifest = {
    apiVersion = "monitoring.googleapis.com/v1"
    kind       = "PodMonitoring"

    metadata = {
      name      = each.value.name
      namespace = "default"
    }
    spec = {
      selector = {
        matchLabels = {
          app = each.value.app_label
        }
      }
      endpoints = [
        {
          port     = "metrics"
          interval = "30s"
        }
      ]
    }
  }
}

# Create notification channel for alerts
resource "google_monitoring_notification_channel" "email_notification_channel" {
  display_name = "Yahia El Tai Email"
  type         = "email"

  labels = {
    email_address = var.email_address
  }
}

# Create uptime health check for services
resource "google_monitoring_uptime_check_config" "uptime_checks" {
  for_each = { for item in local.uptime_checks : item.display_name => item }

  display_name = each.value.display_name
  timeout      = "10s"
  checker_type = "STATIC_IP_CHECKERS"
  period       = "900s"

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = var.host
    }
  }

  http_check {
    accepted_response_status_codes {
      status_value = 200
    }
    path = each.value.path
  }
}

resource "google_monitoring_alert_policy" "alert_policies" {

  for_each = { for item in local.uptime_checks : item.display_name => item }

  display_name = each.value.alert_policy_display_name
  combiner     = "OR"


  notification_channels = [google_monitoring_notification_channel.email_notification_channel.id]

  conditions {
    display_name = "Failure of uptime check_id ${element(
      split(
        "/",
        google_monitoring_uptime_check_config.uptime_checks[each.key].id
      ),
      length(
        split(
          "/",
          google_monitoring_uptime_check_config.uptime_checks[each.key].id
        )
      ) - 1
    )}"

    condition_threshold {
      filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"${element(
        split(
          "/",
          google_monitoring_uptime_check_config.uptime_checks[each.key].id
        ),
        length(
          split(
            "/",
            google_monitoring_uptime_check_config.uptime_checks[each.key].id
          )
        ) - 1
      )}\" AND resource.type=\"uptime_url\""

      aggregations {
        alignment_period     = "1200s"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        group_by_fields      = ["resource.label.*"]
      }

      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1

      trigger {
        count = 1
      }
    }
  }

}



