# Create key ring and key for KMS encryption for helm secrets
resource "google_kms_key_ring" "ms_commerce_key_ring" {
  name     = var.keyring_name
  location = var.region
}

# Output for the KMS keyring name
output "kms_keyring_name" {
  value       = google_kms_key_ring.ms_commerce_key_ring.name
  description = "The name of the created KMS key ring."
}

resource "google_kms_crypto_key" "ms_commerce_key" {
  name     = var.key_name
  key_ring = "projects/${var.project_id}/locations/${var.region}/keyRings/${var.keyring_name}"
}

# Output for the KMS crypto key name
output "kms_crypto_key_name" {
  value       = google_kms_crypto_key.ms_commerce_key.name
  description = "The name of the created KMS crypto key."
}