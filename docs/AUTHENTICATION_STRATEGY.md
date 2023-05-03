### Authentication strategy

Basic Authentication with email and password is provided for this project using an express middleware at the `account` service.

All requests are forwarded to the `account` service and if the request is authenticated then it's proxied to its original destination.

Proyxing requests is handled with `http-proxy-middleware` within the cluster.

More information about how proxying is configured can be found [here](../services/account/README.md#proxying)

### cert-manager

At the moment, the project lacks HTTPS support and solely relies on the less secure HTTP protocol.

This project utilizes the complimentary credits available on Google Cloud Platform (GCP) with an Autopilot Kubernetes (k8s) cluster on Google Kubernetes Engine (GKE). Due to the inherent constraints on resources in this setup, it is not feasible to install cert-manager.
