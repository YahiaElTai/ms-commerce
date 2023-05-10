# Create Artifact Registry repository
resource "google_artifact_registry_repository" "ms_commerce_repository" {
  repository_id = var.repository_name
  location      = var.region
  format        = "DOCKER"
}

# Output for the Artifact Registry repository URL
output "artifact_registry_repository_url" {
  value       = google_artifact_registry_repository.ms_commerce_repository.repository_url
  description = "The URL of the created Artifact Registry repository."
}