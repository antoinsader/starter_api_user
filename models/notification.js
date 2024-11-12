const mongoose = require("mongoose");

const noftificationSchema = new mongoose.Schema(
  {
    receipt_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type:String },
    sender_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: "string",
      enum: ["unread", "read"],
      default: "unread"
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", noftificationSchema);
