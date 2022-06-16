import { createServer } from 'http';
import 'dotenv/config';
import { processingRoutes } from './routes.js';

const PORT = process.env.PORT || 8000;

const server = createServer((req, res) => {
  processingRoutes(req, res);
});

server.listen(PORT, () => {
  console.log('Start listen');
});

server.on('error', (error) => {
  console.log(error);
});
