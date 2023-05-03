## Account Service

This service provides authentication and projects management for users

## Data model

Data modeling is done with prisma. You can check it out [here](/services/account/src/prisma/schema.prisma)

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  firstName String   @default("")
  lastName  String   @default("")
  password  String
  projects  String[] @default([])
  version   Int      @default(1)
}

model Project {
  id  String @id @default(auto()) @map("_id") @db.ObjectId
  key String @unique
}
```

### Authentication

All requests are initially directed to the `account` service for authentication.

The `authentication-middleware` serves to validate the user's token, as well as confirm their access to the specific project.

Upon successful authentication, the request proceeds to be proxied to its original destination.

### Proxying

Proxying requests is handled with [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) within the cluster.

```typescript
export const productProxyMiddleware = createProxyMiddleware({
  target: 'http://ms-product.default.svc.cluster.local:3002',
  changeOrigin: true,
});

export const cartProxyMiddleware = createProxyMiddleware({
  target: 'http://ms-cart.default.svc.cluster.local:3001',
  changeOrigin: true,
});

app.use(
  '/api/:projectKey/products(/.*)?',
  proxyMiddlewares.productProxyMiddleware
);
app.use('/api/:projectKey/carts(/.*)?', proxyMiddlewares.cartProxyMiddleware);
```

### Projects bucketing

Projects serve as data repositories, allowing users to create various resources (e.g., carts, products) within the projects they have access to.

Currently, endpoints associated with users or projects do not have any permissions, which means any user can add or delete projects and assign them to other users.

In a real-world production application, there would be multiple levels of permissions to control user actions and access. However, incorporating such a system would significantly increase the complexity of the project, which is not desired at this time.

### Events

This service does not emit any events because no other services require information about users and projects.
