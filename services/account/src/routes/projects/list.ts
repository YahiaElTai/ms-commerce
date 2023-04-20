import express, { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { ParseQueryParamsSchema, QueryParamsSchema } from '../../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/account/projects', async (req: Request, res: Response) => {
  // to ensure proper validations on `limit` and `offset`
  // first these should be parsed to integer with `parseInt()` with `ParseQueryParamsSchema`
  // and then passed to `QueryParamsSchema` for proper validation
  const parsedValues = ParseQueryParamsSchema.parse(req.query);

  const { limit, offset, sortBy, sortDirection } = QueryParamsSchema.parse({
    ...req.query,
    ...parsedValues,
  });

  const projects = await prisma.project.findMany({
    skip: offset,
    take: limit,
    orderBy: { [sortBy]: sortDirection },
  });

  res.send({
    offset,
    limit,
    count: projects.length,
    results: projects,
  });
});

export { router as ListProjectsRouter };
