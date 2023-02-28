import Router from "express";
import AuthController from "./controller";

const router = Router();

import {
    validateLogin,
    validationRegister,
    isUserExistsRegister,
} from './middleware';

router.post('/login', [validateLogin], AuthController.login);
router.post('/register', [validationRegister, isUserExistsRegister], AuthController.register);

export default router;