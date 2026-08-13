import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // Institute Centres
    centres: [
      {
        name: {
          type: String,
          default: "",
        },
        location: {
          type: String,
          default: "",
        },
      },
    ],

    logo: {
      type: String,
      default: "",
    },

    adminName: {
      type: String,
      default: "",
    },

    adminEmail: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Academic

    academicSession: {
      type: String,
      default: "",
    },

    admissionStatus: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    // Social Links

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    telegram: {
      type: String,
      default: "",
    },

    // Theme

    themeColor: {
      type: String,
      default: "#2563eb",
    },

    secondaryColor: {
      type: String,
      default: "#0f172a",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Settings", settingsSchema);
