import express, { Request, Response } from 'express';
import { BadRequestError, VersionMistachError } from '../errors';
import { prisma } from '../prisma';
import {
  Actions,
  AddLineItemActionSchema,
  CartDraftUpdateSchema,
  ChangeLineItemQuantityActionSchema,
  RemoveLineItemActionSchema,
} from '../validators';
import { IdParamSchema } from '../validators/params-validators';

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
  });

  if (!existingCart) {
    throw new BadRequestError(`Cart with ID '${id}' could not be found`);
  }

  if (existingCart.version !== version) {
    throw new VersionMistachError();
  }

  for (const action of actions) {
    switch (action.type) {
      case Actions.Enum.addLineItem: {
        const validatedAction = AddLineItemActionSchema.parse(action);

        await prisma.cart.update({
          where: { id },
          data: {
            lineItems: {
              create: validatedAction.value,
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
    include: { lineItems: true },
  });

  return res.send(updatedCart);
});

export { router as UpdateCartRouter };
