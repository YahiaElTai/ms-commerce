export interface Action {
  type: string;
  value: {
    [key: string]: any;
  };
}
// starting and building should be per service
// testing, linting, formatting should be from the root

export const isValidAction = (action: Action) => {
  switch (action.type) {
    case 'addLineItem':
      if (!action?.value?.sku && typeof action.value.sku !== 'string') {
        throw new Error('You must provide a valid sku');
      }
      if (
        !action?.value?.quantity &&
        typeof action.value.quantity !== 'number'
      ) {
        throw new Error('You must provide a valid quantity');
      }
      break;
    case 'removeLineItem':
      if (!action?.value?.sku && typeof action.value.sku !== 'string') {
        throw new Error('You must provide a valid sku');
      }
      break;
    case 'changeLineItemQuantity':
      if (!action?.value?.sku && typeof action.value.sku !== 'string') {
        throw new Error('You must provide a valid sku');
      }

      if (
        !action?.value?.quantity &&
        typeof action.value.quantity !== 'number'
      ) {
        throw new Error('You must provide a valid quantity');
      }
      break;
    default:
      return true;
  }

  return true;
};
