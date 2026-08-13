import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    school: {
      type: String,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      enum: ["Class XI", "Class XII"],
    },

    board: {
      type: String,
      required: true,
      enum: ["WBCHSE", "CBSE", "ISC"],
    },

    address: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    // NEW FIELD
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
