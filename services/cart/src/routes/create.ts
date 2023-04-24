import express, { Request, Response } from 'express';
import { computeCartFields } from '../model';
import { validateCurrencyWithVariants, validateVariantsExists } from '../utils';
import { prisma } from '../prisma';
import {
  CartDraftCreateSchema,
  CartSchema,
  ProductSchema,
  VariantSchema,
} from '../validators';
import { ProjectKeyParamSchema } from '../validators/params-validators';

const router = express.Router();

// In order to create a cart, 2 validations need to pass
// 1. Each sku provided has to have a matching variant
// 2. the currency of the cart needs to match with the currency of the price on all variants found by the above validation

router.post(
  '/api/:projectKey/carts',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { projectKey } = ProjectKeyParamSchema.parse(req.params);

    const { customerEmail, currency, lineItems } = CartDraftCreateSchema.parse(
      req.body
    );

    // validate that a variant exist matching the SKUs provided
    const skus = lineItems.map((lineItem) => lineItem.sku);

    const validatedProducts = await validateVariantsExists(skus);

    validateCurrencyWithVariants(currency, validatedProducts);

    for (const lineItem of lineItems) {
      // for each line item find the related product and validate it
      const relatedProduct = validatedProducts.find((product) =>
        product.variants.some((variant) => variant.sku === lineItem.sku)
      );
      const validatedProduct = ProductSchema.parse(relatedProduct);

      // for each sku in line items find the variant and validate it
      const variant = validatedProduct.variants.find(
        (variant) => variant.sku === lineItem.sku
      );
      const validatedVariant = VariantSchema.parse(variant);

      // create a line item and connect both price and variant as a snapshot
      await prisma.lineItem.create({
        data: {
          productName: validatedProduct.name,
          productKey: validatedProduct.productKey,
          quantity: lineItem.quantity,
          variant: {
            create: {
              sku: validatedVariant.sku,
              price: {
                create: {
                  centAmount: validatedVariant.price.centAmount,
                  currencyCode: validatedVariant.price.currencyCode,
                  fractionDigits: validatedVariant.price.fractionDigits,
                },
              },
            },
          },
          price: {
            create: {
              centAmount: validatedVariant.price.centAmount,
              currencyCode: validatedVariant.price.currencyCode,
              fractionDigits: validatedVariant.price.fractionDigits,
            },
          },
        },
      });
    }

    const createdLineItems = await prisma.lineItem.findMany({
      where: {
        variant: {
          sku: {
            in: skus,
          },
        },
      },
    });

    // create a cart and connect all created line items above
    const cart = await prisma.cart.create({
      data: {
        projectKey,
        customerEmail,
        currency,
        lineItems: {
          connect: createdLineItems.map((lineItem) => ({ id: lineItem.id })),
        },
      },
      include: {
        lineItems: {
          include: {
            price: true,
            variant: {
              include: {
                price: true,
              },
            },
          },
        },
      },
    });

    const validatedCart = CartSchema.parse(cart);

    const computedCart = computeCartFields(validatedCart);

    res.status(201).send(computedCart);
  }
);

export { router as CreateCartRouter };
