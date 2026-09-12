import mongoose from "mongoose";
import { Task } from "../models/tasks.models.js";
import { subTask } from "../models/subtask.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async handeler.js";

export const createSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { projectId, taskId } = req.params;

  const task = await Task.findOne({
    _id: taskId,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task not found!");

  const newSubTask = await subTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newSubTask, "SubTask Created Successfully!"));
});

export const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const existingSubTask = await subTask.findById(subTaskId);
  if (!existingSubTask) throw new ApiError(404, "SubTask not found!");

  //members are only allowed to toggle completion (enforced at the route level
  //via validateProjectPermission), admins/project_admins can also rename it
  if (title !== undefined) existingSubTask.title = title;
  if (isCompleted !== undefined) existingSubTask.isCompleted = isCompleted;

  await existingSubTask.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, existingSubTask, "SubTask Updated Successfully!"),
    );
});

export const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const deletedSubTask = await subTask.findByIdAndDelete(subTaskId);
  if (!deletedSubTask) throw new ApiError(404, "SubTask not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, deletedSubTask, "SubTask Deleted Successfully!"));
});
