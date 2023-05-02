import type * as http from 'http';
import type { Request } from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

// https://github.com/chimurai/http-proxy-middleware/issues/40#issuecomment-249430255
// body-parser and http-proxy-middleware don't play well together
const restream = (proxyReq: http.ClientRequest, req: Request) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    // stream the content
    proxyReq.write(bodyData);
  }
};

export const productProxyMiddleware = createProxyMiddleware({
  target: 'http://product-srv.default.svc.cluster.local:3002',
  changeOrigin: true,
  onProxyReq: restream,
});

export const cartProxyMiddleware = createProxyMiddleware({
  target: 'http://cart-srv.default.svc.cluster.local:3001',
  changeOrigin: true,
  onProxyReq: restream,
});
