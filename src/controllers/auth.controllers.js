import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async handeler.js";
import {
  emailVerificationfromMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import { cookie } from "express-validator";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong when generating access tokens!",
    );
  }
};

//wrapping it in asyincHandler so that we dont have to deal with try catch
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // if either username or email is present don't register
  });

  if (existedUser)
    throw new ApiError(409, "User with email or username already exists", []);

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    //we send unhashed token in mail as it goes to user!
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationfromMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering a user");

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "user registered successfully and verification email has been sent on your email!",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(400, "User does not exist!");
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials!");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully!",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        //$set changes any value
        refreshToken: "", //empty means now user is logged out
      },
    },
    {
      new: true, //gives the updates object
    },
  );

  const options = {
    //options for response!
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched Succesfully!"));
});

//http://localhost:8000/api/v1/users/verify-email/80f2f504e8a7fc91840a4609eb81b447f27b76ef      this is how out URL looks like to verify mail, we just need to extract the last part

//we can access the url using req.params
const verifyEmail = asyncHandler(async (req, res) => {
  const { verficationToken } = req.params;

  if (!verficationToken)
    throw new ApiError(400, "Email verification token is missing");

  let hashedToken = crypto //since we send unhashed token in mail, we need to hash it again and then match it with existing database hashed token!
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex"); //will give the same hashed token that was stored in the database

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() }, //{} means condition gt means greater than
  });
  if (!user) throw new ApiError(400, "Token is invalid or expired!");

  user.emailVerificationToken = undefined; //cleanup since we now dont need this
  user.emailVerificationExpiry = undefined; //cleanup since we now dont need this
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },
      "Email is verified",
    ),
  );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User Does not Exist");

  if (user.isEmailVerified)
    throw new ApiError(409, "Email is already verified");

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    //we send unhashed token in mail as it goes to user!
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationfromMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering a user");

  return res
    .status(200)
    .json(new ApiResponse(200, "Mail has been sent to your email id!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookie.refreshToken || req.body.refreshToken;

  if (!refreshAccessToken) throw new ApiError(401, "Unauthorized Access");

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh Token");

    if (incommingRefreshToken !== user?.refreshToken) {
      //checking if refresh token exist in database or maybe expired!
      throw new ApiError(401, "Refresh token is Expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id); //refreshToken: --- basically aliasing

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Tokem Refreshed!",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token!");
    console.log(error);
  }
});

// const getCurrentUser= asyncHandler(async (req,res)=>{})
export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
};
