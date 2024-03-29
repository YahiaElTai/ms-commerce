## Cart Service

This service provides basic CRUD operations for carts

## Data model

Data modeling is done with prisma. You can check it out [here](/services/cart/src/prisma/schema.prisma)

The model has 2 parts

- The actual data stored in the database using Prisma modeling
- Computed fields that are not stored in the database but calculated on the fly to avoid sync issues.

  All Caluclated fields are mentioned as comment in the code snippet.

```prisma
model LineItem {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  quantity    Int     @default(1)
  productName String
  productKey  String?
  price Price?
  variant Variant?
  cart   Cart?   @relation(fields: [cartId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  cartId String? @db.ObjectId

  // computed fields include: totalPrice
  // - totalPrice is the price * the quantity
}

model Cart {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  currency      Currency
  customerEmail String?
  lineItems  LineItem[]
  version    Int        @default(1)
  projectKey String

  // computed fields for carts: totalLineItemQuantity, totalPrice
  // - `totalLineItemQuantity` is the sum of all line item quantities
  // - `totalPrice` is the sum of all totalPrice from line items
}
```

#### What is a Line Item?

A line item is a snapshot of a variant at the cart creation time.

When a line item is created all the data from variants are copied over to the line item such as `price` and `sku`.

This is a business decision is all commerce shops to avoid cart changes when the underlying product changes.

### Creating a cart

The Product service will emit events about creating and updating products with details about all their variants.

Cart service will listen for those events and store the exact products in its own database.

Once a request comes in to create a cart, it will be created using the product details stored in its own database
to reduce coupling with the product service

And then compute all extra fields required and finally send the cart to the user.

### Updating a cart

Cart updated are handled using update actions. The cart is versioned with a `version` field to keep track of updates.

Currently the following update actions are supported:

- `addLineItem`
- `removeLineItem`
- `changeLineItemQuantity`

### Listing carts

Pagination and sorting are added when fetching carts. the default limit is `20` carts fetched at a time.

### Events

The cart service publishes its own events and also listens to events from other services.

**Events Listened to**:

- `product_created`, `product_updated`, `product_deleted`, `product_all_deleted`
