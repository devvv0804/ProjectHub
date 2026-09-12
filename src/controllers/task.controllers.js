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

  const tasks = await Task.find(
    (project = new mongoose.Types.ObjectId(projectId)),
  ).populate("assignedTo", "avatar username fullName"); //without using agregation pipelines!;

  return res
    .status(201)
    .json(new ApiResponse(201, tasks, "Task fetched Successfully!"));
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found!");

  const files = req.files || [];

  files.map((file) => {
    return {
      urL: `${process.env.SERVER_URL}/images/${file.originalname}`,
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
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
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
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
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
  //
});

export const deleteTask = asyncHandler(async (req, res) => {
  //
});

export const createSubTask = asyncHandler(async (req, res) => {
  //
});

export const updateSubTask = asyncHandler(async (req, res) => {
  //
});

export const deleteSubTask = asyncHandler(async (req, res) => {
  //
});
