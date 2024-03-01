import express from 'express';
import {
  getProductById,
  getProducts,
} from './steps/get-products/getProducts.js';
// import { getProducts } from './steps/get-products/getProductsCopy.js';

const routes = express.Router();

routes.get('/products', getProducts);
routes.get('/products/:id', getProductById);

export default routes;
