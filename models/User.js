const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    avatarUrl: { type: String, required: false, default: "" },
    coverUrl: { type: String, required: false, default: "" },

    aboutMe: { type: String, required: false, default: "" },
    city: { type: String, required: false, default: "" },
    country: { type: String, required: false, default: "" },
    company: { type: String, required: false, default: "" },
    jobTitle: { type: String, required: false, default: "" },
    facebookLink: { type: String, required: false, default: "" },
    instagramLink: { type: String, required: false, default: "" },
    linkedinLink: { type: String, required: false, default: "" },
    twitterLink: { type: String, required: false, default: "" },

    isDeleted: { type: Boolean, default: false, select: false },
    friendCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
