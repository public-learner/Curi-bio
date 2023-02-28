import Router from "express";
import UserController from "./controller";

const router = Router();

import {
    authenticateToken,
    isUserExistsUpdate,
} from './middleware';

router.post('/update', [authenticateToken, isUserExistsUpdate], UserController.update);
router.delete('/:id', [authenticateToken], UserController.remove);
router.get('/', [authenticateToken], UserController.getUserInfo);

export default router;