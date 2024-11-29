import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    notiType: { type: String, enum: ["alert", "message"], required: true },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users receiving the notification
    isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have read the notification
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
