import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ProjectKeyParamSchema } from '../validators';

const router = express.Router();

router.delete(
  '/api/:projectKey/products',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { projectKey } = ProjectKeyParamSchema.parse(req.params);

    const { count } = await prisma.product.deleteMany({
      where: {
        projectKey,
      },
    });

    res.send([
      {
        message: `${count} products have been deleted successfully in project "${projectKey}"`,
      },
    ]);
  }
);

export { router as DeleteProductsRouter };
