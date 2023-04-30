## Logging and Monitoring

### Logging

Logging is set up using `winston` library, which is a popular logging library for Node.js applications written in TypeScript.

Winston is set up to output messages to the console with the appropriate level, following the GCP Logging format. This makes it easy to view and analyze logs directly in the console and to aggregate them in GCP Logging which is managed logging system for further processing and analysis.

In order to ensure effective logging in our microservices app, each microservice has been configured with two distinct loggers: `requestLogger` and `applicationLogger`.

- `requestLogger` is designed to log all incoming requests to the microservice, and is equipped with helpful metadata such as `projectKey`, `userId`, `correlationId`, `statusCode` and so on. This logger is passed as a middleware to Expressjs, allowing us to easily track and analyze incoming requests

- `applicationLogger` is responsible for logging messages from the application itself. This logger is especially useful for logging errors, which can be easily tracked and analyzed through the use of this logger.

### Monitoring

Coming soon
