import express from "express";
import ctrlUser from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

import { authSignupSchema, authSigninSchema  } from "../schemas/authSchemas.js";

authRouter.post("/register", isEmptyBody, validateBody(authSignupSchema), ctrlUser.signup);
authRouter.post("/login", isEmptyBody, validateBody(authSigninSchema), ctrlUser.signin);
authRouter.post("/logout", authenticate, ctrlUser.logout);
authRouter.get("/current", authenticate, ctrlUser.getCurrentUser);

export default authRouter;
