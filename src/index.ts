import { createServer } from 'http';
import { processingRequest } from './routes.js';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;

const server = createServer((req, res) => {
  processingRequest(req, res);
});

server.listen(PORT, () => {
  console.log('Start listen');
});

server.on('error', (error) => {
  console.log(error);
});
