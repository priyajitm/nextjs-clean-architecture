import { Schema, model, models } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  email: string;
  password: string;
  roles: UserRole[];
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User = models.User || model<IUser>("User", UserSchema);
