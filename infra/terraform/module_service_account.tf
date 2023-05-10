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