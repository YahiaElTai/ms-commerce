import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@ms-commerce/common";
import { Cart, CartDraft } from "../models/cart";
import { CloudPubSub, Topics } from "../pub-sub";

const pubSubClient = new CloudPubSub();

const router = express.Router();

router.post(
  "/api/carts",
  requireAuth,
  [
    body("customerEmail").isEmail(),
    body("currency")
      .notEmpty()
      .withMessage("Currency is required")
      .isIn(["EUR", "USD", "RUB"])
      .withMessage('Currency must be one of "EUR", "USD" or "RUB"'),
    body("lineItems")
      .isArray({ min: 1 })
      .withMessage("You must add at least one line item to the cart"),
    body("shippingMethodId").notEmpty(),
    body("shippingAddress").notEmpty(),
    body("billingAddress").notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const cart = new Cart<CartDraft>(req.body);
    cart.save();

    const messageId = await pubSubClient.publishMessage(
      Topics.CART_CREATED,
      cart
    );

    res.status(201).send({ cart, messageId });
  }
);

export { router as CreateCartRouter };
