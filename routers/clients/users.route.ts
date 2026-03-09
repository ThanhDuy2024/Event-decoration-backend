import { Router } from "express";
import { loginUsers } from "../../controllers/clients/users.controller";

const router = Router();

router.post('/register', loginUsers);

export default router;