import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ProjectNote } from "../models/note.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async handeler.js";

export const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found!");

  const notes = await ProjectNote.find({
    project: new mongoose.Types.ObjectId(projectId),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched Successfully!"));
});

export const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await ProjectNote.findById(noteId);
  if (!note) throw new ApiError(404, "Note not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched Successfully!"));
});

export const createNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found!");

  const note = await ProjectNote.create({
    project: new mongoose.Types.ObjectId(projectId),
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note Created Successfully!"));
});

export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  const note = await ProjectNote.findByIdAndUpdate(
    noteId,
    { content },
    { new: true },
  );

  if (!note) throw new ApiError(404, "Note not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note Updated Successfully!"));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await ProjectNote.findByIdAndDelete(noteId);
  if (!note) throw new ApiError(404, "Note not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note Deleted Successfully!"));
});
