const { Schema, model } = require("mongoose");

const fieldExecutiveSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
  code: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  siteId: { type: Schema.Types.ObjectId, ref: "Site" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  regNumber: { type: String, required: true, unique: true },
  vehicle: { type: String, required: true },
  present: { type: Boolean },
  activeStatus: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const FieldExecutive = model("FieldExecutive", fieldExecutiveSchema);
module.exports = FieldExecutive;
