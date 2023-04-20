import express, { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { prisma } from '../../prisma';
import { IdParamSchema, ProjectSchema } from '../../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/account/projects/:id', async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new NotFoundError(`Project with ID '${id}' could not be found`);
  }

  const validatedProject = ProjectSchema.parse(project);

  res.send(validatedProject);
});

export { router as GetProjectRouter };
