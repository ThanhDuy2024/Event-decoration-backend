import { Router } from "express";
import { detailProduct, getProduct } from "../../controllers/clients/products.controller";
const router = Router();

router.get('/list', getProduct);
router.get('/detail/:id', detailProduct);
export default router;