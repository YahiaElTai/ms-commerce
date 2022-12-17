### Project overview

The project is a simplified clone version of some of the services at commercetools written as microservices.

### Description

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

### [Architecture Diagram](/docs/ms-commerce.png)

### [Recreate GCP Project for production](/docs/Recreate_GCP_Project.md)

### [Local Development Setup](/docs/Local_Development_Setup.md)
