import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../errors';
import { prisma } from '../../prisma';
import {
  Actions,
  IdParamSchema,
  UserDraftUpdateSchema,
} from '../../validators';
import { VersionMistachError } from '../../errors/version-mismatch';
import { ActionSchema } from '../../validators';
import { UserSchema } from '../../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/api/account/users/:id', async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);

  const { action, version } = UserDraftUpdateSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError(`User with ID '${id}' could not be found`);
  }

  if (existingUser.version !== version) {
    throw new VersionMistachError();
  }

  switch (action.type) {
    case Actions.Enum.addProject:
      {
        const validatedAction = ActionSchema.parse(action);

        // validate that the project already exists first and then add it to the list
        const existingProject = await prisma.project.findUnique({
          where: { key: validatedAction.value.key },
        });

        if (!existingProject) {
          throw new NotFoundError(
            `Project with key '${validatedAction.value.key}' could not be found`
          );
        }

        await prisma.user.update({
          where: { id },
          data: {
            projects: {
              push: validatedAction.value.key,
            },
            version: {
              increment: 1,
            },
          },
        });
      }
      break;
    case Actions.Enum.removeProject: {
      const validatedAction = ActionSchema.parse(action);

      const updatedProjectList = existingUser.projects.filter(
        (project) => project !== validatedAction.value.key
      );

      await prisma.user.update({
        where: { id },
        data: {
          projects: {
            set: updatedProjectList,
          },
          version: {
            increment: 1,
          },
        },
      });

      break;
    }
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!updatedUser) {
    throw new BadRequestError(
      `User with ID '${id}' could not be found. This is likely a server error. If this issue persist, please contact our support team.`
    );
  }

  const validatedUser = UserSchema.parse(updatedUser);

  return res.send(validatedUser);
});

export { router as UpdateUserRouter };
