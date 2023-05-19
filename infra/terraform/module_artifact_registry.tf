# # Create Artifact Registry repository
# resource "google_artifact_registry_repository" "ms_commerce_repository" {
#   repository_id = var.repository_name
#   location      = var.region
#   format        = "DOCKER"
# }

# # Output for the Artifact Registry repository ID
# output "artifact_registry_repository_id" {
#   value       = google_artifact_registry_repository.ms_commerce_repository.id
#   description = "The ID of the created Artifact Registry repository."
# }