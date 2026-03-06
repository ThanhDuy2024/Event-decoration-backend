import { Router } from "express";
import adminRoute from "../servers/admin.route";
import categoryRoute from "./categories.route";
import productRoute from './product.route';
import { adminMiddleware } from "../../middlewares/admin.middleware";
const router = Router();

router.use('/auth', adminRoute);
router.use('/category', adminMiddleware, categoryRoute);
router.use('/product', adminMiddleware, productRoute);
export default router;