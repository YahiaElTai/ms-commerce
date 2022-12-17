### Project overview

The project is a simplified version of commercetools HTTP API written as microservices.

### Technologies

- Languages: TypeScript (auth & cart services).
- Database: PostgreSQL hosted on GCP Cloud SQL (all services).
- Database ORM: Prisma for services written in TypeScript.
- Image registry: Artifact Registry on GCP.
- Inter-service Communication: Cloud Pub/Sub.
- Deployment: Kubernetes cluster on GCP with autopilot mode.
- CI/CD: CircleCI
- Code sharing:
  - Common middlewares and utilities are published as a separate package `@ms-commerce/common` for services written in TypeScript.

### Services

1. Auth
2. Cart
3. Projects (Not yet implemented)
4. Order (Not yet implemented)
5. Customer (Not yet implemented)
6. Product (Not yet implemented)
7. Settings (Not yet implemented)

Each service has basic CRUD operations with a highly simplified schema.

### API Documentation

Postman docs can be found [here](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

### Events

- **Cart service**: `cart_created`, `cart_updated`, `cart_deleted`
- **Order service**: `order_created`, `order_updated`
- **Customer service**: `customer_created`, `customer_updated`, `customer_deleted`
- **Product service**: `product_created`, `product_updated`, `product_deleted`
- **Settings service**: `shipping_method_created`, `shipping_method_updated`, `shipping_method_deleted`

### [Infrastructure Provisioning on GCP](/docs/INFRASTRUCTURE_PROVISIONING_ON_GCP.md)

### [Local Development Setup](/docs/Local_Development_Setup.md)

### Authentication strategy

Authentication is extracted out to its own microservice on the cluster called `auth-srv`.

Basic Authentication with email and password is set up with [Nginx-Ingress](https://kubernetes.github.io/ingress-nginx/examples/auth/external-auth/) using annotations.

- The first annotation tells the `nginx-ingress` controller to forward the incoming request first to the `auth-srv` microservice, and then if the `auth-srv` responds with an `200 Ok` then on to the downstream route.

- The second annotation is used to pass custom headers to the downstream route such as `UserId` and `UserEmail`.

  ```yaml
  nginx.ingress.kubernetes.io/auth-url: http://auth-srv.default.svc.cluster.local:3000/api/users/authenticate
  nginx.ingress.kubernetes.io/auth-method: POST
  nginx.ingress.kubernetes.io/auth-response-headers: UserId,UserEmail
  ```
