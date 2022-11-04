import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@ms-commerce/common";
import { Cart, CartDraft } from "../models/cart";
import { PubSub } from "@google-cloud/pubsub";
import pubSubRepo from "../pub-sub";

const pubSubClient = new PubSub({
  projectId: "gcp-mss",
});
const topicName = "cart_created";
const { publishMessage } = pubSubRepo;

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

    const messageId = await publishMessage(pubSubClient, topicName, {
      id: cart.id,
    });

    res.status(201).send({ cart, messageId });
  }
);

export { router as CreateCartRouter };
