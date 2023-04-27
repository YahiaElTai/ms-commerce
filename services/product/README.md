## Product Service

This service provides basic CRUD operations for products

## Data model

Data modeling is done with prisma. You can check it out [here](/services/product/src/prisma/schema.prisma)

```prisma
enum Currency {
  EUR
  USD
  GBP
}

model Price {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  centAmount     Int
  currencyCode   Currency @default(EUR)
  fractionDigits Int      @default(2)
  variant        Variant? @relation(fields: [variantId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  variantId      String   @unique @db.ObjectId
}

model Variant {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  sku       String   @unique
  price     Price?
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  productId String   @unique @db.ObjectId
}

model Product {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  name        String
  description String?
  productKey  String?
  variants    Variant[]
  version     Int       @default(1)
  projectKey  String
}
```

### Updating a product

Prdoducts updated are handled using update actions. The product is versioned with a `version` field to keep track of updates.

Currently the following update actions are supported:

- `addVariant`
- `removeVariant`
- `changeVariantPrice`

### Listing products

Pagination and sorting are added when fetching products. the default limit is `20` products fetched at a time.

### Events

The product service publishes its own events

**Published events**:

- `product_created`, `product_updated`, `product_deleted`, `product_all_deleted`
