### Project overview

The project is a simplified clone version of some of the services at commercetools written as microservices.

### Technologies

- The project is deployed on kubernetes cluster on GCP with autopilot mode.
- Written in TypeScript
- PostgreSQL is used for all services and hosted on GCP Cloud SQL.
- Communication between services is done with Cloud Pub/Sub.
- Docker images are stored in Artifact Registry
- CI/CD: CircleCI

### Services

1. authentication
2. cart
3. order
4. customer
5. product
6. settings

Each service has basic crud operations with a highly simplified data model.

### API Documentation

The documentation for this project was created with postman and can be found [here](https://documenter.getpostman.com/view/8722825/2s8YsryZiW).

### Events

- **Cart service**: `cart_created`, `cart_updated`, `cart_deleted`
- **Order service**: `order_created`, `order_updated`
- **Customer service**: `customer_created`, `customer_updated`, `customer_deleted`
- **Product service**: `product_created`, `product_updated`, `product_deleted`
- **Settings service**: `shipping_method_created`, `shipping_method_updated`, `shipping_method_deleted`

### [Recreate GCP Project for production](/docs/Recreate_GCP_Project.md)

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
