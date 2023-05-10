### Project overview

The project is a highly simplified version of commercetools HTTP API written as microservices and deployed on GCP with kubernetes.

The project is currently deployed across two environments: Staging and Production.

- Production: `mss-commerce.com`
- Staging: `staging.mss-commerce.com`

These environments are managed using Terraform workspaces. Detailed information about the infrastructure setup can be found below

### Tech Stack

| Stack                       | Detail                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| Language                    | [TypeScript](https://www.typescriptlang.org)                                                       |
| Database                    | [MongoDB Atlas](https://www.mongodb.com/atlas/database)                                            |
| Database ORM                | [Prisma](https://www.prisma.io/)                                                                   |
| Kubernetes Package Manager  | [Helm](https://helm.sh/)                                                                           |
| API Gateway                 | [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/)                                       |
| Inter-service Communication | [Kafka on Confluent Cloud](https://www.confluent.io/confluent-cloud/)                              |
| Docker Image Registry       | [GCP Artifact Registry](https://cloud.google.com/artifact-registry)                                |
| Secrets Management          | [GCP KMS](https://cloud.google.com/security-key-management)                                        |
| CI/CD                       | [CircleCI](https://circleci.com/)                                                                  |
| Infrastructure as Code      | [Terraform](https://developer.hashicorp.com/terraform/downloads)                                   |
| Logging                     | [GCP Cloud Logging](https://cloud.google.com/logging)                                              |
| Monitoring                  | [GCP Managed Service for Prometheus](https://cloud.google.com/stackdriver/docs/managed-prometheus) |
| Operational Dashboards      | [Grafana](https://grafana.com/)                                                                    |

### Services Overview

1. **[Account](/services/account/README.md)** ✅
2. **[Cart](/services/cart/README.md)** ✅
3. **[Product](/services/product/README.md)** ✅
4. **Customer** ⏳
5. **Order** ⏳

### Documentations

- [TypeScript Overview](/docs/OVERVIEW_TYPESCRIPT.md)

- [Swagger API Documentation](https://app.swaggerhub.com/apis-docs/YAHIAELTAI022_1/ms-commerce/1.2.0#/).

- [Logging and Monitoring](/docs/LOGGING_MONITORING.md)

- [GCP Infrastructure Provisioning](/docs/GCP_INFRASTRUCTURE_PROVISIONING.md)

- [Terraform Overview](/docs/TERRAFORM_OVERVIEW.md)

- [Local Development Setup](/docs/LOCAL_DEV_SETUP.md)

### Microservices Architecture Decisions

- [Authentication strategy](/docs/AUTHENTICATION_STRATEGY.md)

- [Data consistency](/docs/DATA_CONSISTENCY.md)
