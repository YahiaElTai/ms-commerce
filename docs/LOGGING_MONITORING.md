# Logging and Monitoring

## Logging

Logging is set up using `winston` library, which is a popular logging library for Node.js applications written in TypeScript.

Winston is set up to output messages to the console with the appropriate level, following the GCP Logging format. This makes it easy to view and analyze logs directly in the console and to aggregate them in GCP Logging which is managed logging system for further processing and analysis.

In order to ensure effective logging in our microservices app, each microservice has been configured with two distinct loggers: `requestLogger` and `applicationLogger`.

- `requestLogger` is designed to log all incoming requests to the microservice, and is equipped with helpful metadata such as `projectKey`, `userId`, `correlationId`, `statusCode` and so on. This logger is passed as a middleware to Expressjs, allowing us to easily track and analyze incoming requests

- `applicationLogger` is responsible for logging messages from the application itself. This logger is especially useful for logging errors, which can be easily tracked and analyzed through the use of this logger.

## Monitoring

### Uptime checks

Uptime checks with their own alert policies and notification channels are created via terraform in this [file](../infra/terraform/main.tf).

GCP Uptime checks are configured with alerts to send notifications (via email for now) when they fail.

Each service in the microservices architecture exposes a `/health` endpoint for monitoring the health and availability of the individual services. These endpoints are used to set up uptime checks in GCP to monitor the services and receive alerts in case of any downtime or performance issues.

The `/health` endpoints provide a lightweight way to assess the health of each microservice by returning an HTTP `200` OK status code when the service is running and operational. This helps to minimize the processing overhead and ensures a quick response for health checks`

These are the endpoints available currently:

- `http://mss-commerce.com/api/account/health`
- `http://mss-commerce.com/api/products/health`
- `http://mss-commerce.com/api/carts/health`

### Monitoring with Prometheus

#### Overview

Google Cloud Managed Service for Prometheus is Google Cloud's fully managed, multi-cloud, cross-project solution for Prometheus metrics. It lets you globally monitor and alert on your workloads, using Prometheus, without having to manually manage and operate Prometheus at scale.

Managed Service for Prometheus collects metrics from Prometheus exporters and lets you query the data globally using PromQL, meaning that you can keep using any existing Grafana dashboards, PromQL-based alerts, and workflows. It is hybrid- and multi-cloud compatible, can monitor both Kubernetes and VM workloads, retains data for 24 months, and maintains portability by staying compatible with upstream Prometheus

#### Managed collection

Managed collection runs Prometheus-based collectors as a Daemonset and ensures scalability by only scraping targets on colocated nodes. You configure the collectors with lightweight custom resources to scrape exporters using pull collection, then the collectors push the scraped data to the central data store Monarch. Google Cloud never directly accesses your cluster to pull or scrape metric data; your collectors push data to Google Cloud

Managed collection reduces the complexity of deploying, scaling, sharding, configuring, and maintaining the collectors.

#### Configure a PodMonitoring resource

To ingest the metric data emitted by the example application, you use target scraping. Target scraping and metrics ingestion are configured using Kubernetes custom resources. The managed service uses `PodMonitoring` custom resources (CRs).

```yaml
# Example PodMonitoring matching k8s service with label `prom-example` at a port named `metrics`
apiVersion: monitoring.googleapis.com/v1
kind: PodMonitoring
metadata:
  name: prom-example
spec:
  selector:
    matchLabels:
      app: prom-example
  endpoints:
    - port: metrics
      interval: 30s
```

`PodMonitoring` CR are created via terraform for each k8s service with port name `metrics` and scraping interval of `30s`. Terraform file is located [here](../infra/terraform/main.tf)

In turn each k8s service in this project exposes a port named `metrics` with value `7788` which provides all the metrics scraped from the given service for the `PodMonitoring` to use.

#### Monitoring middleware

Monitoring is handled via a middleware for Nodejs called `@promster/express` which adds many helpful metrics to track and additional metrics can be added later on.

This middleware is used for each service.

Because most requests are proxied from the `account` service, the proxying itself is not scraped.

`@promster` also has a subpackage `@promster/server` which exposes the collected metrics at port `7788`.

### Grafana

Managed Service for Prometheus uses the built-in Prometheus data source for Grafana

Google Cloud APIs all require authentication using OAuth2; however, Grafana doesn't support OAuth2 authentication for Prometheus data sources. To use Grafana with Managed Service for Prometheus, you use the standalone Prometheus frontend UI as an authentication proxy.

The process for authenticating Grafana with GCP APIs is described [here](https://cloud.google.com/stackdriver/docs/managed-prometheus/query#ui-grafana)
