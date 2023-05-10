# fetch k8s cluster information from GKE to authenticate k8s and helm providers
data "google_container_cluster" "ms_commerce_cluster_info" {
  name     = var.k8s_cluster_name
  project  = var.project_id
  location = var.region
}