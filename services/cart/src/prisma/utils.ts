// Excluding the cartId from the result of fetching the line items on the cart just for now
// until Prisma has this feature natively
// https://github.com/prisma/prisma/issues/5042
export const excludeCartIdFromLineItem = {
  id: true,
  version: true,
  customerEmail: true,
  lineItems: {
    select: {
      id: true,
      quantity: true,
      sku: true,
    },
  },
};
