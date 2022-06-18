import { createServer } from 'http';
import { processingRequest } from './routes/routes.js';
import 'dotenv/config';

const PORT = process.env.PORT;

const server = createServer((req, res) => {
  processingRequest(req, res);
});

server.listen(PORT, () => {
  console.log('Started listening');
});

server.on('error', (error) => {
  console.log(error);
});
