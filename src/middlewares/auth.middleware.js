//in websites, accesstokens is transported by cookies, but in mobile apps, headers take them
//basically this file checks if the person is valid and avoids the repetition of code in everyother controller!
// key:Autherization Value:Bearer [accessToken]

import { User } from "../models/user.model.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async handeler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", ""); //header not headers!
  //since format is Bearer [accessToken] but we only want accessToken

  if (!token) {
    throw new ApiError(401, "Unauthorized Request!");
  }
  //since token is encoded, we need to decode it and it may also give error thats why try catch
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    if (!projectId) throw new ApiError(400, "Project Id is missing!");

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) throw new ApiError(400, "Project not found!");

    const givenRole = project?.role;
    req.user.role = givenRole;

    if (!roles.includes(givenRole))
      throw new ApiError(
        403,
        "You don't have permission to perform this action!",
      );

    next();
  });
};
