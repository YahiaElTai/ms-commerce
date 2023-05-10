# Enable required services
resource "google_project_service" "enabled_services" {
  for_each = toset(local.enabled_gcp_services)

  service            = each.value
  disable_on_destroy = false
}