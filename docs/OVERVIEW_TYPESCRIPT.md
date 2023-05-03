## TypeScript Overview

### Type checking

Services written in TypeScript uses a recommended base config called [@tsconfig/node18-strictest](https://github.com/tsconfig/bases) which offers as the name implies the strictest type checking for NodeJS.

Also included is [@typescript-eslint](https://typescript-eslint.io/) plugin.

`@typescript-eslint` enables ESLint to run on TypeScript code. It brings in the best of both tools to help you write the best TypeScript code you possibly can.

This puling provides the following:

- allows ESLint to parse TypeScript syntax
- creates a set of tools for ESLint rules to be able to use TypeScript's type information
- provides a large list of lint rules that are specific to TypeScript and/or use that type information

### Data validation

TypeScript types are removed during runtime which is one of the major inconveniences with TypeScript.

Many libraries are available to resolve this issue such as [zod](https://zod.dev).

Zod is a TypeScript-first schema declaration and validation library. The term "schema" broadly refer to any data type, from a simple string to a complex nested object.

With Zod, you declare a validator (schema) once and Zod will automatically infer the static TypeScript type. It's easy to compose simpler types into complex data structures.

All declared validatos (schemas) have methods on them including `parse` and `safeParse`.

- Given any Zod schema, you can call its `.parse` method to check data is valid. If it is, a value is returned with full type information! Otherwise, an error is thrown.
- If you don't want Zod to throw errors when validation fails, use `.safeParse`. This method returns an object containing either the successfully parsed data or a ZodError instance containing detailed information about the validation problems.

Zod validators can be composed to create any complex data structure.

Another neat feature of Zod is that you can extract the type from any schema using `z.infer<typeof mySchema>` which then can be used to type functions or variables.

### Error handling

Error handling is done using an express middlware which catches all errors thrown from any route.
These errors could generate from:

- Zod validation errors
- Custom errors to help the user understand what they did wrong (eg: resource with ID is not found)
- Prisma errors
- Catch all error handler to catch runtime error and respond with 500 status code

### Testing

Integration Tests are written using [Supertest](https://github.com/ladjs/supertest).

### ORM

ORM for MongoDB is [Prisma](https://www.prisma.io/)

Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.

Prisma is an open source next-generation ORM. It consists of the following parts:

- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration system
- Prisma Studio: GUI to view and edit data in your database

### Kubernetes Readiness and Liveness probes

These are provided to each pod using [lightship](https://github.com/gajus/)

Lightship abstracts readiness, liveness and startup checks and graceful shutdown of Node.js services running in Kubernetes.
