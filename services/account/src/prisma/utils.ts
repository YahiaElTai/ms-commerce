// Excluding the password from the result of fetching the user
// until Prisma has this feature natively
// https://github.com/prisma/prisma/issues/5042
export const excludePasswordFromUser = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  version: true,
  projects: true,
};
