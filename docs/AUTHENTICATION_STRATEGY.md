### Authentication strategy

Authentication is extracted out to its own microservice on the cluster called `ms-commerce-auth`.

Basic Authentication with email and password is set up with [Nginx-Ingress](https://kubernetes.github.io/ingress-nginx/examples/auth/external-auth/) using annotations.

- The first annotation tells the `nginx-ingress` controller to forward the incoming request first to the `ms-commerce-auth` microservice, and then if the `ms-commerce-auth` responds with an `200 Ok` then on to the downstream route.

- The second annotation is used to pass custom headers to the downstream route such as `UserId` and `UserEmail`.

  ```yaml
  nginx.ingress.kubernetes.io/auth-url: http://ms-commerce-auth.default.svc.cluster.local:3000/api/users/authenticate
  nginx.ingress.kubernetes.io/auth-method: POST
  nginx.ingress.kubernetes.io/auth-response-headers: UserId,UserEmail
  ```
