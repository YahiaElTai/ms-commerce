# Enable required services
resource "google_project_service" "enabled_services" {
  for_each = toset(local.enabled_gcp_services)

  service            = each.value
  disable_on_destroy = false
}

# Create CI service account to authenticate to Artifact Registry, GKE and KMS
resource "google_service_account" "ci_service_account" {
  account_id   = local.ci_service_account_account_id
  display_name = local.ci_service_account_display_name
}

# Output for the CI service account email
output "ci_service_account_email" {
  value       = google_service_account.ci_service_account.email
  description = "The email of the CI service account."
}

# Add needed roles for CI service account
resource "google_project_iam_member" "ci_sa_roles" {
  for_each = toset(local.ci_service_account_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.ci_service_account.email}"
}

# # Create Autopilot GKE cluster
# resource "google_container_cluster" "ms_commerce_cluster" {
#   name     = var.k8s_cluster_name
#   project  = var.project_id
#   location = var.region
#   ip_allocation_policy {}
#   enable_autopilot = true
# }

# # Output for the GKE cluster endpoint
# output "gke_cluster_endpoint" {
#   value       = google_container_cluster.ms_commerce_cluster.endpoint
#   description = "The endpoint of the created GKE Autopilot cluster."
# }

# #  Install ingress_nginx controller chart via helm
# #  Ensure `config_path = "~/.kube/config"` contains access to the cluster created above
# resource "helm_release" "ingress_nginx" {
#   name             = "ingress-nginx"
#   repository       = "https://kubernetes.github.io/ingress-nginx"
#   chart            = "ingress-nginx"
#   create_namespace = true
#   namespace        = "ingress-nginx"
# }

# # Create key ring and key for KMS encryption for helm secrets
# resource "google_kms_key_ring" "ms_commerce_key_ring" {
#   name     = var.keyring_name
#   location = var.region
# }

# # Output for the KMS keyring name
# output "kms_keyring_name" {
#   value       = google_kms_key_ring.ms_commerce_key_ring.name
#   description = "The name of the created KMS key ring."
# }

# resource "google_kms_crypto_key" "ms_commerce_key" {
#   name     = var.key_name
#   key_ring = "projects/${var.project_id}/locations/${var.region}/keyRings/${var.keyring_name}"
# }

# # Output for the KMS crypto key name
# output "kms_crypto_key_name" {
#   value       = google_kms_crypto_key.ms_commerce_key.name
#   description = "The name of the created KMS crypto key."
# }

# # Create PodMonitoring CR for GCP managed Prometheus service
# resource "kubernetes_manifest" "pod_monitoring" {
#   for_each = { for item in local.pod_monitoring : item.name => item }

#   manifest = {
#     apiVersion = "monitoring.googleapis.com/v1"
#     kind       = "PodMonitoring"

#     metadata = {
#       name      = each.value.name
#       namespace = "default"
#     }
#     spec = {
#       selector = {
#         matchLabels = {
#           app = each.value.app_label
#         }
#       }
#       endpoints = [
#         {
#           port     = "metrics"
#           interval = "30s"
#         }
#       ]
#     }
#   }
# }

# Create notification channel for alerts
resource "google_monitoring_notification_channel" "email_notification_channel" {
  display_name = "Yahia El Tai Email"
  type         = "email"

  labels = {
    email_address = var.email_address
  }
}

# # Create uptime health check for services
# resource "google_monitoring_uptime_check_config" "uptime_checks" {
#   for_each = { for item in local.uptime_checks : item.display_name => item }

#   display_name = each.value.display_name
#   timeout      = "10s"
#   checker_type = "STATIC_IP_CHECKERS"
#   period       = "900s"

#   monitored_resource {
#     type = "uptime_url"
#     labels = {
#       project_id = var.project_id
#       host       = var.host
#     }
#   }

#   http_check {
#     accepted_response_status_codes {
#       status_value = 200
#     }
#     path = each.value.path
#   }
# }

# resource "google_monitoring_alert_policy" "alert_policies" {

#   for_each = { for item in local.uptime_checks : item.display_name => item }

#   display_name = each.value.alert_policy_display_name
#   combiner     = "OR"


#   notification_channels = [google_monitoring_notification_channel.email_notification_channel.id]

#   conditions {
#     display_name = "Failure of uptime check_id ${element(
#       split(
#         "/",
#         google_monitoring_uptime_check_config.uptime_checks[each.key].id
#       ),
#       length(
#         split(
#           "/",
#           google_monitoring_uptime_check_config.uptime_checks[each.key].id
#         )
#       ) - 1
#     )}"

#     condition_threshold {
#       filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"${element(
#         split(
#           "/",
#           google_monitoring_uptime_check_config.uptime_checks[each.key].id
#         ),
#         length(
#           split(
#             "/",
#             google_monitoring_uptime_check_config.uptime_checks[each.key].id
#           )
#         ) - 1
#       )}\" AND resource.type=\"uptime_url\""

#       aggregations {
#         alignment_period     = "1200s"
#         cross_series_reducer = "REDUCE_COUNT_FALSE"
#         per_series_aligner   = "ALIGN_NEXT_OLDER"
#         group_by_fields      = ["resource.label.*"]
#       }

#       duration        = "60s"
#       comparison      = "COMPARISON_GT"
#       threshold_value = 1

#       trigger {
#         count = 1
#       }
#     }
#   }

# }



