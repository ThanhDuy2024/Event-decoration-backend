import { Router } from "express";
import { deleteProduct, getOneProduct, getProduct, postProduct, putProduct } from "../../controllers/servers/products.controller";
import multer from "multer";
import { storage } from "../../configs/cloudinary.config";
const router = Router();
const upload = multer({
  storage: storage,
});

router.post('/create', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), postProduct);
router.get('/list', getProduct);
router.put('/edit/:id', upload.single('image'), putProduct);
router.get('/list/:id', getOneProduct);
router.delete('/delete/:id', deleteProduct);
export default router;