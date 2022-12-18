### Project overview

The project is a simplified version of commercetools HTTP API written as microservices.

### Technologies

- **Languages**: TypeScript (auth & cart services).
- **Database**: PostgreSQL hosted on GCP Cloud SQL (all services).
- **Database** ORM: Prisma for services written in TypeScript.
- **Image registry**: Artifact Registry on GCP.
- **Inter-service** Communication: Cloud Pub/Sub.
- **Deployment**: Kubernetes cluster on GCP with autopilot mode.
- **CI/CD**: CircleCI
- **Code sharing**:
  - Common middlewares and utilities are published as a separate package `@ms-commerce/common` for services written in TypeScript.

### Services

1. Authentication
2. Cart (In progress)
3. Order (Not yet implemented)
4. Customer (Not yet implemented)
5. Product (Not yet implemented)
6. Pricing (Not yet implemented)
7. Account (Not yet implemented)

   Inlcudes: Profile, Projects, Organizations

8. Settings (Not yet implemented)

   Inlcudes: Taxes, Shipping methods, Currencies, Countries

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

### Data consistency

There are generally 2 approaches to ensure data consistency across microservices:

1.  **Distributed transactions**

    In a distributed transaction, transactions are executed on two or more resources (e.g. databases, message queues). Data integrity is guaranteed across multiple databases by distributed transaction manager or coordinator.

2.  **Eventual consistency**

    Eventual consistency is a model used in distributed systems to achieve high availability. In an eventual consistent system, inconsistencies are allowed for a short time until solving the problem of distributed data.

    This model doesn’t apply to distributed ACID transactions across microservices. Eventual consistency uses the BASE database model.

The approach selected for this project: **Eventual consistency**

Eventual consistency can be achieved using the Materialized View Pattern with event based communication via Cloud Pub/Sub.

A materialized view is a read-only representation of the source data in a format that best serves that specific microservice.

This approach ensures loose coupling between microservices at the trade-off of eventual consistency and data duplication.

**Example Flow**

- A POST request is sent to the cart service to create a new cart.
- The cart service creates the cart and stores it in its own database and then sends an event `cart_created` containing JSON of the new cart with all its fields.
- This event is sent via Cloud Pub/Sub to a specific topic `cart_created`, the later can have many subscribers for example the order service and the customer service need to know when a new cart is created.
- Each service that cares about `cart_created` event subscribes to that topic and creates a handler to receive incoming events from that topic.
- A handler's responsibility is to ensure data is synchronized between its local version and the source data (cart service) by duplicating the data.
- The services that care about the `cart` data never updates its own local version of the data since it's read-only but only updates it when it receives events.

The above flow ensures that the `cart` data is (eventually) consistent across all microservices that cares about it.
