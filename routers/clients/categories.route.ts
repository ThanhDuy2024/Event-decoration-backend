import { Router } from "express";
import { getCategories } from "../../controllers/clients/categories.controller";

const router = Router();

router.get('/list', getCategories);

export default router;