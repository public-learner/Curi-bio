import Router from "express";

import AuthRouter from "./services/auth/routes";
import UserRouter from "./services/user/routes";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

export = router;