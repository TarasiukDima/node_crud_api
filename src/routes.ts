import { IncomingMessage, ServerResponse } from "http";

export const processingRoutes = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url, req.method);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('good request');
}
