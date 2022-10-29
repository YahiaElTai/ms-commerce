import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from "@ms-commerce/common";
import { Cart } from "../models/cart";
import { isValidAction, Action } from "../utils";

const router = express.Router();

router.post(
  "/api/carts/:id",
  [
    body("version").isNumeric().withMessage("Version must be a number"),
    body("action.type")
      .isIn(["addLineItem", "removeLineItem", "changeLineItemQuantity"])
      .withMessage("You must provide a valid action type"),
    body("action").custom(isValidAction),
  ],
  validateRequest,
  requireAuth,
  async (
    req: Request<{ id: string }, any, { action: Action; version: number }>,
    res: Response
  ) => {
    const { action, version } = req.body;
    const { id } = req.params;

    const existingCart = await Cart.findById(id);

    if (!existingCart) {
      throw new BadRequestError("Cart with given ID was not found");
    }

    if (existingCart.version !== version) {
      throw new BadRequestError("Version mismatch");
    }

    if (action.type === "addLineItem") {
      const updatedCart = await Cart.findOneAndUpdate(
        { id },
        {
          $push: { lineItems: action.value },
          $set: {
            version: existingCart.version + 1,
          },
        },
        { new: true }
      );

      return res.send(updatedCart);
    }

    if (action.type === "changeLineItemQuantity") {
      const lineItem = existingCart.lineItems.find(
        (lineItem) => lineItem.sku === action.value.sku
      );

      if (!lineItem) {
        throw new BadRequestError(
          "Line item with given SKU could not be found"
        );
      }

      const updatedCart = await Cart.findOneAndUpdate(
        { id: id, "lineItems.sku": lineItem.sku },
        {
          $set: {
            version: version + 1,
            "lineItems.$.quantity": action.value.quantity,
          },
        },
        { new: true }
      );

      return res.send(updatedCart);
    }

    if (action.type === "removeLineItem") {
      const updatedCart = await Cart.findOneAndUpdate(
        { id },
        {
          $set: {
            version: version + 1,
          },
          $pull: { lineItems: { sku: action.value.sku } },
        },
        { new: true }
      );
      return res.send(updatedCart);
    }
  }
);

export { router as UpdateCartRouter };
