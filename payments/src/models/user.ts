import mongoose from "mongoose";
import { UserRoles } from "@hrrtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.set("versionKey", "version");

userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    firstName: attrs.firstName,
    lastName: attrs.lastName,
    email: attrs.email,
    role: attrs.role,
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
