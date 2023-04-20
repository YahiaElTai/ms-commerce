import express, { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { prisma } from '../../prisma';
import { IdParamSchema } from '../../validators';

const router = express.Router();

router.delete(
  '/api/account/projects/:id',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { id } = IdParamSchema.parse(req.params);

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundError(`Project with ID '${id}' could not be found`);
    }

    await prisma.project.delete({ where: { id } });

    res.send([
      { message: `Project with ID '${id}' was successfully deleted.` },
    ]);
  }
);

export { router as DeleteProjectRouter };
