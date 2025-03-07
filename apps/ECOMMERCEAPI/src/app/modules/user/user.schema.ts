import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    hasAccess: {
      type: Boolean,
      required: false,
      default: true,
    },
    address: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    createdAtString: {
      type: String,
      required: false,
    },
    updatedAtString: {
      type: String,
      required: false,
    }
  }, {versionKey: false, timestamps: true }
);
