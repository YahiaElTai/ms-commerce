### Project overview

The project is a simplified version of commercetools HTTP API written as microservices and deployed on GCP with kubernetes.

### Tech Stack

| Stack                       | Detail                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Languages                   | **TypeScript**: Authentication & Cart & Product services <br> **Golang**: Customer & Order & Pricing & Account services |
| Database                    | **PostgreSQL** on [GCP Cloud SQL](https://cloud.google.com/sql)                                                         |
| Database ORM                | [Prisma](https://www.prisma.io/) for TS <br> [Gorm](https://gorm.io/) for Golang                                        |
| Kubernetes Package Manager  | [Helm](https://helm.sh/)                                                                                                |
| API Gateway                 | [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/)                                                            |
| Inter-service Communication | **Undecided yet**                                                                                                       |
| Docker Image Registry       | [Artifact Registry](https://cloud.google.com/artifact-registry) on GCP                                                  |
| CI/CD                       | [CircleCI](https://circleci.com/)                                                                                       |

### Services

> some services have a README.md to give a general overview of how they work.

1. **Authentication** ✅
2. **[Cart](/services/cart/README.md)** ⏳
3. **Product** ⏳
4. **Customer** ⏳
5. **Order** ⏳
6. **Pricing** ⏳
7. **Account** ⏳

   Inlcudes: Profile, Projects, Organizations

8. **Settings** ⏳

   Inlcudes: Taxes, Shipping methods, Currencies, Countries

### High level overview of services by language

- [Services written in TypeScript](/docs/OVERVIEW_TYPESCRIPT.md)

- [Services written in Golang](/docs/OVERVIEW_GOLANG.md)

### API Documentation

Postman docs can be found [here](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

### [Infrastructure Provisioning](/docs/INFRASTRUCTURE_PROVISIONING_ON_GCP.md)

### [Local Development Setup](/docs/LOCAL_DEV_SETUP.md)

### Microservices Architecture Decisions

- [Authentication strategy](/docs/AUTHENTICATION_STRATEGY.md)

- [Data consistency](/docs/DATA_CONSISTENCY.md)
