### Project overview

The project is a simplified version of commercetools HTTP API written as microservices and deployed on GCP with kubernetes.

### Tech Stack

| Stack                       | Detail                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Languages                   | **TypeScript**: Authentication & Cart & Product services <br> **Golang** Customer & Order & Pricing & Account services |
| Database                    | **PostgreSQL** on [GCP Cloud SQL](https://cloud.google.com/sql)                                                        |
| Database ORM                | [Prisma](https://www.prisma.io/) for TS <br> [Gorm](https://gorm.io/) for Golang                                       |
| Kubernetes Package Manager  | [Helm](https://helm.sh/)                                                                                               |
| API Gateway                 | [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/)                                                           |
| Inter-service Communication | **Undecided yet**                                                                                                      |
| Docker Image Registry       | [Artifact Registry](https://cloud.google.com/artifact-registry) on GCP                                                 |
| CI/CD                       | [CircleCI](https://circleci.com/)                                                                                      |

### Services

1. **Authentication** ✅
2. **Cart** ⏳
3. **Product** ⏳
4. **Customer** ⏳
5. **Order** ⏳
6. **Pricing** ⏳
7. **Account** ⏳

   Inlcudes: Profile, Projects, Organizations

8. **Settings** ⏳

   Inlcudes: Taxes, Shipping methods, Currencies, Countries

> Each service has basic CRUD operations with a highly simplified schema.

### API Documentation

Postman docs can be found [here](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

### Events

- **Cart service**: `cart_created`, `cart_updated`, `cart_deleted`
- **Product service**: `product_created`, `product_updated`, `product_deleted`
- **Customer service**: `customer_created`, `customer_updated`, `customer_deleted`
- **Order service**: `order_created`, `order_updated`

### [Infrastructure Provisioning](/docs/INFRASTRUCTURE_PROVISIONING_ON_GCP.md)

### [Local Development Setup](/docs/LOCAL_DEVELOPMENT_SETUP.md)

### Microservices Architecture Decisions

- [Authentication strategy](/docs/AUTHENTICATION_STRATEGY.md)

- [Data consistency](/docs/DATA_CONSISTENCY.md)
