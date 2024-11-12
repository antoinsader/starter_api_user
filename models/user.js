const mongoose = require("mongoose");
const notificationsModel = require("../models/notification");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          // at least one number and one letter
          return /[a-zA-Z]/.test(v) && /[0-9]/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password! It must contain at least one letter and one number.`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
      trim: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post("save", async function(doc, next, ) {
  try{
    const newNoti = new notificationsModel({
      receipt_user_id: doc._id,
      message: `Welcome to our application ${doc.username} !`
      
    })
    await newNoti.save();
    next();
  }catch(ex){
    next(ex);
  }
})

module.exports = mongoose.model("User", userSchema);
