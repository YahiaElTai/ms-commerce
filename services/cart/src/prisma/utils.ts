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
