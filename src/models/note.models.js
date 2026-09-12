import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

//renamed from the previous `projectNode` (typo) to `ProjectNote` so the
//export name matches the model name used by note.controller.js
export const ProjectNote = mongoose.model("ProjectNote", projectNoteSchema);
