import express, { Request, Response } from "express";
import { requireAuth } from "@ms-commerce/common";
import { Cart } from "../models/cart";

const router = express.Router();

router.get("/api/carts", requireAuth, async (req: Request, res: Response) => {
  const carts = await Cart.find({});
  res.send(carts);
});

export { router as CartsRouter };
