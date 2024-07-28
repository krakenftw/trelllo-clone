import mongoose, { Model, Schema, Types } from "mongoose";

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["todo", "in_progress", "under_review", "completed"], default: "todo", required: true },
    priority: { type: String, enum: ["low", "medium", "urgent"] },
    deadline: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export interface ITask extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "under_review" | "completed";
    priority?: "low" | "medium" | "urgent";
    deadline?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const Task = mongoose.model<ITask>("task", TaskSchema);

export default Task;