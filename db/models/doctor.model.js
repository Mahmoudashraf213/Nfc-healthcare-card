import { model, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    specialization: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    // licenseNumber: {
    //   type: String,
    //   trim: true,
    //   unique: true,
    //   required: true,
    // },
  },
  { timestamps: true }
);

export const Doctor = model("Doctor", doctorSchema);
