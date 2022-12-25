### Project overview

The project is a simplified version of commercetools HTTP API written as microservices and deployed on GCP with kubernetes.

### Tech Stack

| Stack                       | Detail                                         |
| --------------------------- | ---------------------------------------------- |
| Languages                   | **TypeScript**: Authentication & Cart services |
| Database                    | **PostgreSQL** (GCP Cloud SQL): All services   |
| Database ORM                | **Prisma** for TypeScript                      |
| Kubernetes Package Manager  | **Helm**                                       |
| API Gateway                 | **Ingress Nginx**                              |
| Inter-service Communication | **Cloud Pub/Sub**                              |
| Docker Image Registry       | **Artifact Registry** on GCP                   |
| CI/CD                       | **CircleCI**                                   |

### Services

1. **Authentication** ✅
2. **Cart** (In progress)
3. **Order** (Not yet implemented)
4. **Customer** (Not yet implemented)
5. **Product** (Not yet implemented)
6. **Pricing** (Not yet implemented)
7. **Account** (Not yet implemented)

   Inlcudes: Profile, Projects, Organizations

8. **Settings** (Not yet implemented)

   Inlcudes: Taxes, Shipping methods, Currencies, Countries

> Each service has basic CRUD operations with a highly simplified schema.

### API Documentation

Postman docs can be found [here](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

### Events

- **Cart service**: `cart_created`, `cart_updated`, `cart_deleted`
- **Order service**: `order_created`, `order_updated`
- **Customer service**: `customer_created`, `customer_updated`, `customer_deleted`
- **Product service**: `product_created`, `product_updated`, `product_deleted`
- **Settings service**: `shipping_method_created`, `shipping_method_updated`, `shipping_method_deleted`

### [Infrastructure Provisioning](/docs/INFRASTRUCTURE_PROVISIONING_ON_GCP.md)

### [Local Development Setup](/docs/LOCAL_DEVELOPMENT_SETUP.md)

### Microservices Architecture Decisions

- [Authentication strategy](/docs/AUTHENTICATION_STRATEGY.md)

- [Data consistency](/docs/DATA_CONSISTENCY.md)
