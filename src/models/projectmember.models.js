import mongoose, { mongo, Schema } from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { Timestamp } from "mongodb";

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRole, //It prevents invalid roles from being stored in MongoDB.
      default: UserRolesEnum.MEMBER,
    },
  },
  { timestamp: true },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
