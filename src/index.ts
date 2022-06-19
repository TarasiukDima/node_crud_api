import 'dotenv/config';
import { createServer } from 'http';
import { processingRequest } from './routes/routes';
import { cpus } from 'os';
import cluster from 'cluster';

const PORT = process.env.PORT;

const addNewServer = (idWorker?: number): void => {
  const server = createServer((req, res) => {
    if (idWorker) {
      console.log(`Process pid: ${process.pid}; worker pid: ${idWorker}`);
    }

    processingRequest(req, res);
  });

  server.listen(PORT, () => {});

  server.on('error', (error) => {
    console.log(error);
  });
};

const addWorker = (): void => {
  const workerApp = cluster.fork();

  workerApp.on('exit', () => {
    console.info(`Worker died. Pid: ${process.pid}.`);
    addWorker();
  });
};

const startServer = (isMulti: boolean) => {
  if (isMulti) {
    if (cluster.isPrimary) {
      const lengthCPUS = cpus().length;

      console.info(`Master! Pid: ${process.pid}!`);

      for (let i = 0; i < lengthCPUS; i++) {
        addWorker();
      }
    } else {
      const idWorker = cluster.worker?.id || 0;

      console.log(`Worker! Node pid: ${process.pid}! Worker pid: ${idWorker}! Port: ${PORT}`);

      addNewServer(idWorker);
    }

    return;
  }

  addNewServer();
};

startServer(!!process.env.MULTI_ENV || false);
