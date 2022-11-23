import express, { Request, Response } from 'express';
import { requireAuth } from '@ms-commerce/common';

const router = express.Router();
const hello = 'sss';
router.get(
  '/api/users/currentuser',
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
