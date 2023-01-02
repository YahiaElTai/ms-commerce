// Excluding the cartId from the result of fetching the line items on the cart just for now
// until Prisma has this feature natively
// https://github.com/prisma/prisma/issues/5042
export const excludeCartIdFromLineItem = {
  id: true,
  version: true,
  currency: true,
  customerEmail: true,
  createdAt: true,
  updatedAt: true,
  lineItems: {
    select: {
      id: true,
      quantity: true,
      sku: true,
    },
  },
};

export const excludeIdsFromProduct = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  version: true,
  productKey: true,
  variants: {
    select: {
      id: true,
      sku: true,
      price: {
        select: {
          centAmount: true,
          currencyCode: true,
          fractionDigits: true,
        },
      },
    },
  },
};
