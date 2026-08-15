import { ApiResponse } from "../utils/api-response.js";

//remember,database may send error and also database is always located in another continent i.e it can take time!
// const healthCheck = (req, res) => {
//   try {
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "Server is running" }));
//   } catch (error) {}
// };

// const healthCheck = async (req, res, next) => {
//   try {
//     const user = await getUserFromDB(); //not made this function as of now
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "Server is running" }));
//   } catch (error) {
//     next(error); //express's build in error handeler!
//   }
// };

import { asyncHandler } from "../utils/async handeler.js";

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
});
export { healthCheck };
