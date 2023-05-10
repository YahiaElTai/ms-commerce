# Create Autopilot GKE cluster
resource "google_container_cluster" "ms_commerce_cluster" {
  name     = var.k8s_cluster_name
  project  = var.project_id
  location = var.region
  ip_allocation_policy {}
  enable_autopilot = true
}

# Output for the GKE cluster endpoint
output "gke_cluster_endpoint" {
  value       = google_container_cluster.ms_commerce_cluster.endpoint
  description = "The endpoint of the created GKE Autopilot cluster."
}

#  Install ingress_nginx controller chart via helm
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  create_namespace = true
  namespace        = "ingress-nginx"
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