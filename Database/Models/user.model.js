const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  email_validated: { type: Boolean, default: false },
  password: { type: String, required: true },
  code: { type: String },
  phoneNumber: { type: String },
  countryId: { type: String, ref: "Country" },
  siteId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
  ],
  divisionId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  ],
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],

  device_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  activeStatus: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
  },
  configStatus: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  mappedDestination: { type: String },
});

const User = model("User", userSchema);
module.exports = User;
