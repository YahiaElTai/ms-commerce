provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  # host                   = "https://${data.google_container_cluster.ms-commerce-cluster-info.endpoint}"
  # client_certificate     = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].client_certificate)
  # client_key             = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].client_key)
  # cluster_ca_certificate = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
    # host                   = "https://${data.google_container_cluster.ms-commerce-cluster-info.endpoint}"
    # client_certificate     = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].client_certificate)
    # client_key             = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].client_key)
    # cluster_ca_certificate = base64decode(data.google_container_cluster.ms-commerce-cluster-info.master_auth[0].cluster_ca_certificate)
  }
}