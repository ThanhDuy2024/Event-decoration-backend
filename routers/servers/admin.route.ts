import { Router } from "express";
import { getProfile, loginAdmin, postAdmin, putProfile } from "../../controllers/servers/admin.controller";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import multer from "multer";
import { storage } from "../../configs/cloudinary.config";

const router = Router()
const upload = multer({
  storage: storage,
})

router.post('/create', postAdmin);

router.post('/login', loginAdmin);

router.get('/profile', adminMiddleware, getProfile);

router.put('/profile', adminMiddleware,  upload.single('image'), putProfile);
export default router;