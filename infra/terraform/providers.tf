provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

data "google_client_config" "provider" {}

# fetch k8s cluster information from GKE to authenticate k8s and helm providers
data "google_container_cluster" "ms_commerce_cluster_info" {
  name     = var.k8s_cluster_name
  project  = var.project_id
  location = var.region
}

provider "kubernetes" {
  host                   = "https://${data.google_container_cluster.ms_commerce_cluster_info.endpoint}"
  token                  = data.google_client_config.provider.access_token
  cluster_ca_certificate = base64decode(data.google_container_cluster.ms_commerce_cluster_info.master_auth[0].cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = "https://${data.google_container_cluster.ms_commerce_cluster_info.endpoint}"
    token                  = data.google_client_config.provider.access_token
    cluster_ca_certificate = base64decode(data.google_container_cluster.ms_commerce_cluster_info.master_auth[0].cluster_ca_certificate)
  }
}