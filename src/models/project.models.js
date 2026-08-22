import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema(
  {
    //timestamps so that we can have created at and updated at fields
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId, //syntax, means i am refreing to some other object
      ref: "User", //"User" should be same as exported name in user.model.js
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema); //Project will be converted in lowercase and pural in the database(by mongoose)
