### Project overview

The project is a simplified version of commercetools HTTP API written as microservices and deployed on GCP with kubernetes.

### Tech Stack

| Stack                       | Detail                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| Languages                   | **TypeScript**: Account, Cart and Product services <br> **Golang**: Customer and Order services |
| Database                    | **MongoDB** on [Atlas](https://www.mongodb.com/atlas/database)                                  |
| Database ORM                | [Prisma](https://www.prisma.io/) for TS                                                         |
| Kubernetes Package Manager  | [Helm](https://helm.sh/)                                                                        |
| API Gateway                 | [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/)                                    |
| Inter-service Communication | Kafka running on [Confluent Cloud](https://www.confluent.io/confluent-cloud/)                   |
| Docker Image Registry       | [GCP Artifact Registry](https://cloud.google.com/artifact-registry)                             |
| Secrets management          | [GCP KMS](https://cloud.google.com/security-key-management)                                     |
| CI/CD                       | [CircleCI](https://circleci.com/)                                                               |
| Infrastructure as code      | [Terraform](https://developer.hashicorp.com/terraform/downloads)                                |

### Services

1. **[Account](/services/account/README.md)** ✅
2. **[Cart](/services/cart/README.md)** ✅
3. **[Product](/services/product/README.md)** ✅
4. **Customer** ⏳
5. **Order** ⏳

### High level overview of services by language

- [Services written in TypeScript](/docs/OVERVIEW_TYPESCRIPT.md)

- [Services written in Golang](/docs/OVERVIEW_GOLANG.md)

### Microservices Architecture Decisions

- [Authentication strategy](/docs/AUTHENTICATION_STRATEGY.md)

- [Data consistency](/docs/DATA_CONSISTENCY.md)

### Documentations

- [API Documentation](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

- [Infrastructure Provisioning](/docs/INFRASTRUCTURE_PROVISIONING_ON_GCP.md)

- [Local Development Setup](/docs/LOCAL_DEV_SETUP.md)
