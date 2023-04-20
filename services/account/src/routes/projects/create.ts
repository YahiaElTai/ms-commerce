import express, { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { ProjectDraftSchema, ProjectSchema } from '../../validators';
import { NotFoundError } from '../../errors';

const router = express.Router();

router.post(
  '/api/account/projects',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { key } = ProjectDraftSchema.parse(req.body);

    // validate that the project already exists first and then add it to the list
    const existingProject = await prisma.project.findUnique({
      where: { key },
    });

    if (existingProject) {
      throw new NotFoundError(`Project with Key '${key}' already exists`);
    }

    const project = await prisma.project.create({
      data: {
        key,
      },
    });

    const validatedProject = ProjectSchema.parse(project);

    res.status(201).send(validatedProject);
  }
);

export { router as CreateProjectRouter };
