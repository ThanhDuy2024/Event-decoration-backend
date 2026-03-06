import { Router } from "express";
import { getProduct, postProduct, putProduct } from "../../controllers/servers/products.controller";
import multer from "multer";
import { storage } from "../../configs/cloudinary.config";

const router = Router();
const upload = multer({
  storage: storage,
});

router.post('/create', upload.single('image'), postProduct);
router.get('/list', getProduct);
router.put('/edit/:id', upload.single('image'), putProduct);
export default router;