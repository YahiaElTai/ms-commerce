import express, { Request, Response } from 'express';
import { BadRequestError, VersionMistachError } from '../errors';
import { computeCartFields } from '../model';
import {
  lineItemExistsInCart,
  validateVariantsExists,
  variantSKUExistsInCart,
} from '../utils';
import { excludeCartIdFromLineItem, prisma } from '../prisma';
import {
  Actions,
  AddLineItemActionSchema,
  CartDraftUpdateSchema,
  CartSchema,
  ChangeLineItemQuantityActionSchema,
  ProductSchema,
  RemoveLineItemActionSchema,
  VariantDraftSchema,
} from '../validators';
import { IdParamSchema } from '../validators/params-validators';

// Currently there's no information given to the user if one of the update actions fail.
// If all succeeds then great, the new updated cart will be send to the user
// if one of them fail, then the execution of update actions will stop as it is an array
// eg: 10 update actions sent, and the 5th one fails, then 6th ... 10th are not executed
// and the error of the 5th update action is sent to the user

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/api/carts/:id', async (req: Request, res: Response) => {
  // Validate ID and parse it into a number as required by PostgreSQL
  const { id } = IdParamSchema.parse(req.params);

  const { actions, version } = CartDraftUpdateSchema.parse(req.body);

  const existingCart = await prisma.cart.findUnique({
    where: { id },
    select: excludeCartIdFromLineItem,
  });

  if (!existingCart) {
    throw new BadRequestError(`Cart with ID '${id}' could not be found`);
  }

  if (existingCart.version !== version) {
    throw new VersionMistachError();
  }

  const validatedExistingCart = CartSchema.parse(existingCart);

  for (const action of actions) {
    switch (action.type) {
      case Actions.Enum.addLineItem: {
        const validatedAction = AddLineItemActionSchema.parse(action);

        // validate line item doesn't exist already with the provided SKU
        // if it exists throw an error
        variantSKUExistsInCart(
          validatedExistingCart,
          validatedAction.value.sku
        );

        // validate that a variant exist with the provided sku
        const products = await validateVariantsExists([
          validatedAction.value.sku,
        ]);

        const validatedProduct = ProductSchema.parse(products[0]);
        const validatedVariant = VariantDraftSchema.parse(
          validatedProduct.variants.find(
            (variant) => variant.sku === validatedAction.value.sku
          )
        );

        await prisma.cart.update({
          where: { id },
          data: {
            lineItems: {
              create: {
                productName: validatedProduct.name,
                productKey: validatedProduct.productKey,
                quantity: validatedAction.value.quantity,
                variant: {
                  create: {
                    sku: validatedVariant.sku,
                    price: {
                      create: validatedVariant.price,
                    },
                  },
                },
                price: {
                  create: validatedVariant.price,
                },
              },
            },
            version: {
              increment: 1,
            },
          },
        });
        break;
      }
      case Actions.Enum.removeLineItem: {
        const validatedAction = RemoveLineItemActionSchema.parse(action);

        // validate line item does exist already with the provided ID
        // throw an error if item doesn't exist already
        lineItemExistsInCart(validatedExistingCart, validatedAction.value.id);

        await prisma.cart.update({
          where: { id },
          data: {
            lineItems: {
              delete: {
                id: validatedAction.value.id,
              },
            },
            version: {
              increment: 1,
            },
          },
        });
        break;
      }
      case Actions.Enum.changeLineItemQuantity: {
        const validatedAction =
          ChangeLineItemQuantityActionSchema.parse(action);

        lineItemExistsInCart(validatedExistingCart, validatedAction.value.id);

        await prisma.cart.update({
          where: { id },
          data: {
            lineItems: {
              update: {
                where: { id: validatedAction.value.id },
                data: {
                  quantity: validatedAction.value.quantity,
                },
              },
            },
            version: {
              increment: 1,
            },
          },
        });
        break;
      }
    }
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id },
    select: excludeCartIdFromLineItem,
  });

  if (!updatedCart) {
    throw new BadRequestError(
      `Cart with ID '${id}' could not be found. This is likely a server error. If this issue persist, please contact our support team.`
    );
  }

  const validatedCart = CartSchema.parse(updatedCart);

  const computedCart = computeCartFields(validatedCart);

  return res.send(computedCart);
});

export { router as UpdateCartRouter };
