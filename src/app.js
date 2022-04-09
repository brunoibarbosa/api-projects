import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './database';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';

import resizeImage from './middlewares/resizeImage';
import tokenRoutes from './routes/tokenRoutes';
import userGroupRoutes from './routes/userGroupRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import projectRoutes from './routes/projectRoutes';
import projectImageRoutes from './routes/projectImageRoutes';
import accountRecoveryRoutes from './routes/accountRecoveryRoutes';

const whiteList = [
  process.env.APP_URL,
];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/projects/images/', express.static(resolve(__dirname, '..', 'uploads', 'images', 'projects')));
app.use('/(*_\\d+x\\d+.(jpe?g|png|webp|avif|tiff|gif|svg))', resizeImage);

app.use('/doc/', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/token/', tokenRoutes);
app.use('/user-group/', userGroupRoutes);
app.use('/user/', userRoutes);
app.use('/category/', categoryRoutes);
app.use('/project/', projectRoutes);
app.use('/project/image/', projectImageRoutes);
app.use('/account-recovery/', accountRecoveryRoutes);

export default app;
