import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";

import { userRegisterValidator } from "../validators/index.js";
import { login } from "../controllers/auth.controllers.js";
import { userLoginValidator } from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser); //we run "()" userRegisterValidator but not validate!! important since its a middleware that takes care of the errors userRegisterValidators finds

router.route("/login").post(userLoginValidator(), validate, login);
//secure routes
router.route("/logout").post(verifyJWT, logoutUser); //middlewares like verifyJWT no ()
export default router;
