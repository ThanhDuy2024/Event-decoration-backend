import { Router } from "express";
import { changePassword, loginUsers, profileUsers, putProfile, registerUsers } from "../../controllers/clients/users.controller";
import { usersMiddleware } from "../../middlewares/users.middleware";
import multer from "multer";
import { storage } from "../../configs/cloudinary.config";

const router = Router();
const upload = multer({
    storage: storage
})
router.post('/register', registerUsers);
router.post('/login', loginUsers);
router.get('/profile', usersMiddleware, profileUsers);
router.put('/profile', usersMiddleware, upload.single('image'), putProfile);
router.put('/change/password', usersMiddleware, changePassword);
export default router;