import { Router } from "express";
import { deleteCategory, getCategory, getOneCategory, postCategory, putCategory } from "../../controllers/servers/categories.controller";
import multer from "multer";
import { storage } from "../../configs/cloudinary.config";
const router = Router();

const upload = multer({
  storage: storage,
});

router.post('/create', upload.single('image'), postCategory);
router.get('/list', getCategory);
router.get('/list/:id', getOneCategory);
router.put('/edit/:id', upload.single('image'), putCategory);
router.delete('/delete/:id', deleteCategory);
export default router;