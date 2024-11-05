import { Schema, model, Document, models } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
});

export const Role = models.Role || model<IRole>("Role", RoleSchema);
