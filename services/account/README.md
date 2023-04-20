## Account Service

This service provides authentication and projects management for users

## Data model

Data modeling is done with prisma. You can check it out [here](/services/account/src/prisma/schema.prisma)

```prisma

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  firstName String   @default("")
  lastName  String   @default("")
  password  String
  projects  String[] @default([])
  version   Int      @default(1)
}

model Project {
  id  Int    @id @default(autoincrement())
  key String @unique
}


```

### Authentication

Authentication is managed at the ingress level, where all incoming requests are initially directed to the /authenticate endpoint for verification. This process involves checking the validity of the access_token. If the request receives a 200 status code in response, the ingress permits it to proceed to its intended destination.

### Projects bucketing

Projects serve as data repositories, allowing users to create various resources (e.g., carts, products) within the projects they have access to.

Currently, endpoints associated with users or projects do not have any permissions, which means any user can add or delete projects and assign them to other users.

In a real-world production application, there would be multiple levels of permissions to control user actions and access. However, incorporating such a system would significantly increase the complexity of the project, which is not desired at this time.

Endpoints related to resources like products and carts are validated through the /authenticate endpoint.

At the /authenticate endpoint, the system verifies the existence of the project and confirms whether the user has access to it. If the validation is successful, the endpoint returns a 200 status code; otherwise, it returns a 400 status code.

### Events

This service does not emit any events because no other services require information about users and projects.
