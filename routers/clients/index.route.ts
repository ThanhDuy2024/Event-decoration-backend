import { Router } from "express";
import usersRouter from "./users.route";
import productsRouter from "./products.route";
import categoryRouter from "./categories.route";
const router = Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/categories', categoryRouter);
export default router;