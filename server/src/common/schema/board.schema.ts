import mongoose, { Model, Schema, Types } from "mongoose";

const BoardSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    todo: [{ type: Schema.Types.ObjectId, ref: "task" }],
    in_progress: [{ type: Schema.Types.ObjectId, ref: "task" }],
    under_review: [{ type: Schema.Types.ObjectId, ref: "task" }],
    completed: [{ type: Schema.Types.ObjectId, ref: "task" }],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export interface IBoard extends Document {
    userId: Types.ObjectId;
    todo: Types.ObjectId[];
    in_progress: Types.ObjectId[];
    under_review: Types.ObjectId[];
    completed: Types.ObjectId[];
    _id: Types.ObjectId;
}

const Board: Model<IBoard> = mongoose.model<IBoard>("board", BoardSchema);

export default Board;