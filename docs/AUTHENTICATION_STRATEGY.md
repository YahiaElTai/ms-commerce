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
