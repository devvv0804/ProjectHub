import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  forgotPasswordRequest,
  changeCurrentPassword,
  resetForgotPassword,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//unsecured Routes
router.route("/register").post(userRegisterValidator(), validate, registerUser); //we run "()" userRegisterValidator but not validate!! important since its a middleware that takes care of the errors userRegisterValidators finds
router.route("/login").post(userLoginValidator(), validate, login);
//this .verificationToken should be same as const {___}= req.params in auth controllers
router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);

router
  .route("/reset-password/:resetToken")
  .post(userForgotPasswordValidator(), validate, resetForgotPassword);

//Secure routes(requied JWT)
router.route("/logout").post(verifyJWT, logoutUser); //middlewares like verifyJWT no ()
router.route("/current-user").post(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);
export default router;
