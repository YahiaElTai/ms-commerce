import express, { Request, Response } from 'express';
import { computeCartFields } from '../model';
import { validateCurrencyWithVariants, validateVariantsExists } from '../utils';
import { excludeCartIdFromLineItem, prisma } from '../prisma';
import { CartDraftCreateSchema } from '../validators';

const router = express.Router();

// In order to create a cart, 2 validations need to pass
// 1. Each sku provided has to have a matching variant
// 2. the currency of the cart needs to match with the currency of the price on all variants found by the above validation

router.post(
  '/api/carts',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { customerEmail, currency, lineItems } = CartDraftCreateSchema.parse(
      req.body
    );

    // validate that a variant exist matching the SKU provided at lineItems[0].sku
    const skus = lineItems.map((lineItem) => lineItem.sku);

    const validatedProducts = await validateVariantsExists(skus);

    validateCurrencyWithVariants(currency, validatedProducts);

    // create the cart with the validated line item
    const cart = await prisma.cart.create({
      data: {
        customerEmail,
        currency,
        lineItems: {
          createMany: {
            data: lineItems,
          },
        },
      },
      select: excludeCartIdFromLineItem,
    });

    const computedCart = await computeCartFields(cart);

    res.status(201).send(computedCart);
  }
);

export { router as CreateCartRouter };
