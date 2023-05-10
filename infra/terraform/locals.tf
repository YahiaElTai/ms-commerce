locals {
  # required GCP services to be enabled
  enabled_gcp_services = [
    "artifactregistry.googleapis.com",
    "container.googleapis.com",
    "cloudkms.googleapis.com"
  ]

  # CircleCI service account to authenticate for the roles mentioned below
  ci_service_account_account_id   = "circleci-sa"
  ci_service_account_display_name = "Circleci SA"
  ci_service_account_roles = [
    "roles/artifactregistry.repoAdmin",
    "roles/container.developer",
    "roles/cloudkms.cryptoKeyDecrypter",
  ]

  # 3 pod monitoring for the 3 services
  pod_monitoring = [
    {
      name      = "prom-ms-account"
      app_label = "account"
    },
    {
      name      = "prom-ms-product"
      app_label = "product"
    },
    {
      name      = "prom-ms-cart"
      app_label = "cart"
    }
  ]

  # Values for uptime checks to be created below
  uptime_checks = [
    {
      display_name              = "Account service uptime check"
      path                      = "/api/account/health"
      alert_policy_display_name = "Account service health check uptime failure"
    },
    {
      display_name              = "Product service uptime check"
      path                      = "/api/products/health"
      alert_policy_display_name = "Product service health check uptime failure"
    },
    {
      display_name              = "Cart service uptime check"
      path                      = "/api/carts/health"
      alert_policy_display_name = "Cart service health check uptime failure"
    }
  ]
}