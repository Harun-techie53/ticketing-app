import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserRoles } from "@hrrtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  createdAt: Date;
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
      default: UserRoles.User,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.get("password"), 12);
    this.set("password", hashedPassword);
  }

  next();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
