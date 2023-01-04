## Cart Service

This service provides basic CRUD operations for carts

## Data model

Data modeling is done with prisma. You can check it out [here](/services/cart/src/prisma/schema.prisma)

The model has 2 parts

- The actual data stored in the database using Prisma modeling
- Computed fields that are not stored in the database but calculated on the fly to avoid sync issues.

  All Caluclated fields are mentioned below

The following is the prisma model which contains also comments regarding the computed fields .

```prisma

model Cart {
  id            Int        @id @default(autoincrement())
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  currency      Currency
  customerEmail String?
  lineItems     LineItem[]
  version       Int        @default(1)
  // computed fields for carts: totalLineItemQuantity, totalPrice
  // - `totalLineItemQuantity` is the sum of all line item quantities
  // - `totalPrice` is the sum of all totalPrice from line items
}

model LineItem {
  id       Int    @id @default(autoincrement())
  quantity Int    @default(1)
  sku      String
  cart     Cart?  @relation(fields: [cartId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  cartId   Int?

  // computed fields for line items: `price`, `totalPrice`, `name` (product name), `productKey`, `sku`
  // `price` is the exact price from the variant as stored in the product service
  // `totalPrice` is the price * the quantity
}

```

### Creating a cart

The Product service (coming soon) will emit events about creating and updating products with details about all their variants.

Cart service will listen for those events and store the exact products in its own database.

Once a request comes in to create a cart, it will be created using the product details stored in its own database
to reduce coupling with the product service

And then compute all extra fields required and finally send the cart to the user.

### Updating a cart

Cart updated are handled using update actions. The cart is versioned with a `version` field to keep track of updates.

Currently the following update actions are supported:

- `addLineItem`
- `removeLineItem`
- `ChangeLineItemQuantity`

### Listing carts

Pagination and sorting are added when fetching carts. the default limit is `20` carts fetched at a time.
