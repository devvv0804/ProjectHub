import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { subTask } from "../models/subtask.models.js";
import { Task } from "../models/tasks.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async handeler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found!");

  //bug fix: was `Task.find((project = new mongoose.Types.ObjectId(projectId)))`
  //that reassigned the outer `project` variable to an ObjectId and passed it directly
  //as the whole filter instead of `{ project: ... }`
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched Successfully!"));
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found!");

  const files = req.files || [];

  //bug fix: previous version called files.map(...) but never assigned the result
  //anywhere, and then referenced an undefined `attachments` variable below.
  //also `file.originalname` doesn't match the actual saved filename, since
  //multer.middleware.js saves files as `${Date.now()}-${file.originalname}`
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Successfully!"));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            //bug fix: this was missing the `$project` operator, so it was an
            //invalid aggregation stage (`{ _id: 1, ... }` is not a valid stage)
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) throw new ApiError(404, "Task Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task Fetched Successfully!"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId, taskId } = req.params;

  const task = await Task.findOne({
    _id: taskId,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task Not Found!");

  const files = req.files || [];
  const newAttachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (assignedTo !== undefined)
    task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  if (newAttachments.length) task.attachments.push(...newAttachments);

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Updated Successfully!"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await Task.findOneAndDelete({
    _id: taskId,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task Not Found!");

  //cascade delete: a task's subtasks shouldn't be left orphaned
  await subTask.deleteMany({ task: task._id });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Deleted Successfully!"));
});
