import express, { Request, Response } from 'express';
import { BadRequestError, VersionMistachError } from '../errors';
import { prisma } from '../prisma';
import { CartUpdateSchema } from '../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/api/carts/:id', async (req: Request, res: Response) => {
  const { version } = CartUpdateSchema.parse(req.body);

  const id = parseInt(req.params.id);

  const existingCart = await prisma.cart.findUnique({
    where: { id },
  });

  if (!existingCart) {
    throw new BadRequestError(`Cart with ID '${id}' could not be found`);
  }

  if (existingCart.version !== version) {
    throw new VersionMistachError();
  }

  //   for (const action of actions) {
  //     switch (action.type) {
  //       case Actions.Enum.addLineItem: {
  //         const validatedAction = AddLineItemActionSchema.parse(action);

  //         await prisma.cart.update({
  //           where: { id },
  //           data: {
  //             lineItems: {
  //               push: [validatedAction.value],
  //             },
  //             version: existingCart.version + 1,
  //           },
  //         });
  //         break;
  //       }

  //       default:
  //         console.log('action not supported');
  //         break;
  //     }
  //   }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  return res.send({ cart: updatedCart });
});

export { router as UpdateCartRouter };
