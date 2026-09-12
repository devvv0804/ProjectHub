import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";
export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower Case")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),

    body("password").trim().notEmpty().withMessage("Password is required"),

    body("fullName").optional().trim(),
  ];
};

export const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required!"),
  ];
};

export const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("old Password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

export const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid"),
  ];
};

export const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("description").optional(),
  ];
};

export const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty!")
      .isEmail()
      .withMessage("Email is invalid!"),
    body("role")
      .notEmpty()
      .withMessage("Role is required!")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid!"),
  ];
};
