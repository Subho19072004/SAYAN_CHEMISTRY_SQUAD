import Settings from "../models/settingsModel.js";

// ======================================================
// GET SETTINGS
// ======================================================

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create default settings if no document exists
    if (!settings) {
      settings = await Settings.create({
        centres: [],
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get settings",
    });
  }
};

// ======================================================
// UPDATE SETTINGS
// ======================================================

export const updateSettings = async (req, res) => {
  try {
    // --------------------------------------------------
    // Find existing settings
    // --------------------------------------------------

    let settings = await Settings.findOne();

    // Create settings document if it doesn't exist
    if (!settings) {
      settings = new Settings();
    }

    // ==================================================
    // GENERAL SETTINGS
    // ==================================================

    if (req.body.instituteName !== undefined) {
      settings.instituteName = req.body.instituteName;
    }

    if (req.body.tagline !== undefined) {
      settings.tagline = req.body.tagline;
    }

    if (req.body.phone !== undefined) {
      settings.phone = req.body.phone;
    }

    if (req.body.whatsappNumber !== undefined) {
      settings.whatsappNumber = req.body.whatsappNumber;
    }

    if (req.body.email !== undefined) {
      settings.email = req.body.email;
    }

    if (req.body.website !== undefined) {
      settings.website = req.body.website;
    }

    if (req.body.address !== undefined) {
      settings.address = req.body.address;
    }

    // ==================================================
    // INSTITUTE CENTRES
    // ==================================================

    if (req.body.centres !== undefined) {
      try {
        let centres = req.body.centres;

        // FormData sends centres as a JSON string
        if (typeof centres === "string") {
          centres = JSON.parse(centres);
        }

        // Make sure centres is an array
        if (!Array.isArray(centres)) {
          return res.status(400).json({
            success: false,
            message: "Centres must be an array.",
          });
        }

        // Clean the centre data
        settings.centres = centres
          .map((centre) => ({
            name: typeof centre.name === "string" ? centre.name.trim() : "",

            location:
              typeof centre.location === "string" ? centre.location.trim() : "",
          }))
          // Remove completely empty centres
          .filter((centre) => centre.name !== "" || centre.location !== "");
      } catch (error) {
        console.error("Centres Parse Error:", error);

        return res.status(400).json({
          success: false,
          message: "Invalid centres data.",
        });
      }
    }

    // ==================================================
    // ADMIN SETTINGS
    // ==================================================

    if (req.body.adminName !== undefined) {
      settings.adminName = req.body.adminName;
    }

    if (req.body.adminEmail !== undefined) {
      settings.adminEmail = req.body.adminEmail;
    }

    // ==================================================
    // ACADEMIC SETTINGS
    // ==================================================

    if (req.body.academicSession !== undefined) {
      settings.academicSession = req.body.academicSession;
    }

    if (req.body.admissionStatus !== undefined) {
      settings.admissionStatus = req.body.admissionStatus;
    }

    // ==================================================
    // SOCIAL LINKS
    // ==================================================

    if (req.body.facebook !== undefined) {
      settings.facebook = req.body.facebook;
    }

    if (req.body.instagram !== undefined) {
      settings.instagram = req.body.instagram;
    }

    if (req.body.youtube !== undefined) {
      settings.youtube = req.body.youtube;
    }

    if (req.body.telegram !== undefined) {
      settings.telegram = req.body.telegram;
    }

    // ==================================================
    // THEME SETTINGS
    // ==================================================

    if (req.body.themeColor !== undefined) {
      settings.themeColor = req.body.themeColor;
    }

    if (req.body.secondaryColor !== undefined) {
      settings.secondaryColor = req.body.secondaryColor;
    }

    // ==================================================
    // LOGO UPLOAD
    // ==================================================

    if (req.files?.logo?.[0]) {
      settings.logo = `/uploads/${req.files.logo[0].filename}`;
    }

    // ==================================================
    // PROFILE IMAGE UPLOAD
    // ==================================================

    if (req.files?.profileImage?.[0]) {
      settings.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // ==================================================
    // SAVE TO DATABASE
    // ==================================================

    await settings.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update settings",
    });
  }
};
