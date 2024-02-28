import express from 'express';
import {
  getProductById,
  getProducts,
} from './controllers/ProductsController.js';

const routes = express.Router();

routes.get('/products', getProducts);
routes.get('/products/:id', getProductById);

export default routes;
