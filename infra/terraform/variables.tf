variable "host" {
  description = "hostname"
  type        = string
}

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "zone" {
  description = "GCP zone"
  type        = string
}

variable "k8s_cluster_name" {
  description = "K8s cluster name"
  type        = string
}

variable "repository_name" {
  description = "Artifact registry repo name"
  type        = string
}

variable "keyring_name" {
  description = "KMS key ring name"
  type        = string
}

variable "key_name" {
  description = "KMS key name"
  type        = string
}

variable "email_address" {
  description = "Email address for GCP alerts"
  type        = string
  sensitive   = true
}