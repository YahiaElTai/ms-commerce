## Requirements

| Name                                                                        | Version  |
| --------------------------------------------------------------------------- | -------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform)    | ~> 1.4.6 |
| <a name="requirement_google"></a> [google](#requirement_google)             | 4.63.1   |
| <a name="requirement_helm"></a> [helm](#requirement_helm)                   | 2.9.0    |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement_kubernetes) | 2.20.0   |

## Providers

| Name                                                                  | Version |
| --------------------------------------------------------------------- | ------- |
| <a name="provider_google"></a> [google](#provider_google)             | 4.63.1  |
| <a name="provider_helm"></a> [helm](#provider_helm)                   | 2.9.0   |
| <a name="provider_kubernetes"></a> [kubernetes](#provider_kubernetes) | 2.20.0  |

## Modules

No modules.

## Resources

| Name                                                                                                                                                                                | Type        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [google_artifact_registry_repository.ms_commerce_repository](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/artifact_registry_repository)           | resource    |
| [google_container_cluster.ms_commerce_cluster](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/container_cluster)                                    | resource    |
| [google_kms_crypto_key.ms_commerce_key](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/kms_crypto_key)                                              | resource    |
| [google_kms_key_ring.ms_commerce_key_ring](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/kms_key_ring)                                             | resource    |
| [google_monitoring_alert_policy.alert_policies](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/monitoring_alert_policy)                             | resource    |
| [google_monitoring_notification_channel.email_notification_channel](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/monitoring_notification_channel) | resource    |
| [google_monitoring_uptime_check_config.uptime_checks](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/monitoring_uptime_check_config)                | resource    |
| [google_project_iam_member.ci_sa_roles](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/project_iam_member)                                          | resource    |
| [google_project_service.enabled_services](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/project_service)                                           | resource    |
| [google_service_account.ci_service_account](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/resources/service_account)                                         | resource    |
| [helm_release.ingress_nginx](https://registry.terraform.io/providers/hashicorp/helm/2.9.0/docs/resources/release)                                                                   | resource    |
| [kubernetes_manifest.pod_monitoring](https://registry.terraform.io/providers/hashicorp/kubernetes/2.20.0/docs/resources/manifest)                                                   | resource    |
| [google_container_cluster.ms_commerce_cluster_info](https://registry.terraform.io/providers/hashicorp/google/4.63.1/docs/data-sources/container_cluster)                            | data source |

## Inputs

| Name                                                                              | Description                  | Type     | Default            | Required |
| --------------------------------------------------------------------------------- | ---------------------------- | -------- | ------------------ | :------: |
| <a name="input_email_address"></a> [email_address](#input_email_address)          | Email address for GCP alerts | `string` | n/a                |   yes    |
| <a name="input_host"></a> [host](#input_host)                                     | hostname                     | `string` | n/a                |   yes    |
| <a name="input_k8s_cluster_name"></a> [k8s_cluster_name](#input_k8s_cluster_name) | K8s cluster name             | `string` | n/a                |   yes    |
| <a name="input_key_name"></a> [key_name](#input_key_name)                         | KMS key name                 | `string` | n/a                |   yes    |
| <a name="input_keyring_name"></a> [keyring_name](#input_keyring_name)             | KMS key ring name            | `string` | n/a                |   yes    |
| <a name="input_project_id"></a> [project_id](#input_project_id)                   | GCP project ID               | `string` | n/a                |   yes    |
| <a name="input_region"></a> [region](#input_region)                               | GCP region                   | `string` | `"europe-west1"`   |    no    |
| <a name="input_repository_name"></a> [repository_name](#input_repository_name)    | Artifact registry repo name  | `string` | n/a                |   yes    |
| <a name="input_zone"></a> [zone](#input_zone)                                     | GCP zone                     | `string` | `"europe-west1-b"` |    no    |

## Outputs

| Name                                                                                                                             | Description                                         |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| <a name="output_artifact_registry_repository_id"></a> [artifact_registry_repository_id](#output_artifact_registry_repository_id) | The ID of the created Artifact Registry repository. |
| <a name="output_ci_service_account_email"></a> [ci_service_account_email](#output_ci_service_account_email)                      | The email of the CI service account.                |
| <a name="output_gke_cluster_endpoint"></a> [gke_cluster_endpoint](#output_gke_cluster_endpoint)                                  | The endpoint of the created GKE Autopilot cluster.  |
| <a name="output_kms_crypto_key_name"></a> [kms_crypto_key_name](#output_kms_crypto_key_name)                                     | The name of the created KMS crypto key.             |
| <a name="output_kms_keyring_name"></a> [kms_keyring_name](#output_kms_keyring_name)                                              | The name of the created KMS key ring.               |
