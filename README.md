### Project overview

The project is a simplified clone version of some of the services at commercetools written as microservices.

### Description

- The project is using a custom VCP with 2 subnet in `europe-west-1` and `us-central1`.
- Written in TypeScript and deployed with kubernetes on GCP.
- MongoDB is used for all services as a self hosted StatefulSet in kubernetes.
- Communication between services is done with Cloud Pub/Sub.
- Docker images are stored in Artifact Registry.
- CI/CD: CircleCI
- Cloud KMS is used to manage secrets for CircleCI

### Services

1. authentication
2. cart
3. order
4. customer
5. product
6. settings

Each service has basic crud operations with a highly simplified data model.

### Events

- **Cart service**: `cart_created`, `cart_updated`, `cart_deleted`
- **Order service**: `order_created`, `order_updated`
- **Customer service**: `customer_created`, `customer_updated`, `customer_deleted`
- **Product service**: `product_created`, `product_updated`, `product_deleted`
- **Settings service**: `shipping_method_created`, `shipping_method_updated`, `shipping_method_deleted`

### [Architecture Diagram](/docs/ms-commerce.png)

### [Recreate GCP Project for production](/docs/Recreate_GCP_Project.md)

### [Local Development Setup](/Local_Development_Setup.md)
