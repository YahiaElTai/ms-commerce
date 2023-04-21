### Authentication strategy

Authentication is extracted out to its own microservice called `account`

Basic Authentication with email and password is set up with [Nginx-Ingress](https://kubernetes.github.io/ingress-nginx/examples/auth/external-auth/) using annotations.

- The first annotation instructs the `nginx-ingress` controller to initially direct incoming requests to the `account` microservice. If the `account` microservice responds with a `200 Ok` status, the request is then forwarded to the downstream route.

- The second annotation enables the passing of custom headers to the downstream route, including headers like `UserId` and `UserEmail`.

  ```yaml
  nginx.ingress.kubernetes.io/auth-url: http://ms-account.default.svc.cluster.local:3000/api/account/authenticate
  nginx.ingress.kubernetes.io/auth-method: POST
  nginx.ingress.kubernetes.io/auth-response-headers: UserId,UserEmail
  ```

### cert-manager

At the moment, the project lacks HTTPS support and solely relies on the less secure HTTP protocol.

This project utilizes the complimentary credits available on Google Cloud Platform (GCP) with an Autopilot Kubernetes (k8s) cluster on Google Kubernetes Engine (GKE). Due to the inherent constraints on resources in this setup, it is not feasible to install cert-manager.

In order to manage TLS certificates, I am considering transitioning to a standard k8s cluster and installing cert-manager to handle these certificates.
