import express from "express";
import { requireAuth } from "@ms-commerce/common";

const router = express.Router();

router.post("/api/users/signout", requireAuth, (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .send({ message: "Successfully signed out" });
});

export { router as signoutRouter };
