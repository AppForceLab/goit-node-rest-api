import { Schema, model } from "mongoose";
import { handleSaveErrors, handleUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/constants.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("findOneAndUpdate", handleUpdateSettings);

userSchema.post("save", handleSaveErrors);
userSchema.post("findOneAndUpdate", handleSaveErrors);

const User = model("user", userSchema);

export default User;
