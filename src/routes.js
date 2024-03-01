import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import {
  getProductById,
  getProducts,
} from './steps/get-products/getProducts.js';

const routes = express.Router();

routes.use('/api', swaggerUi.serve);
routes.get('/api', swaggerUi.setup(swaggerDocument));

routes.get('/products', getProducts);
routes.get('/products/:id', getProductById);

export default routes;
