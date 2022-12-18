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
