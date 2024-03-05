const { Schema, model } = require("mongoose");

const vendorSchema = new Schema({
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  logo: { type: String },
  termCode: { type: String },

  //Address Details
  addressType: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  landMark: { type: String },
  zipCode: { type: String },

  //Vat Details
  vatNo: { type: String, required: true },
  vatExempted: { type: String },
  exemptedReason: { type: String },
  vatDoc: { type: String },

  //Trade Details
  licenseNo: { type: String, required: true },
  expiryDate: { type: Date },
  tradeDoc: { type: String },

  //Account Details
  accountName: { type: String }, //creditors_local,	creditors_overseas
  locationName: { type: String },
  currency: { type: String },
  note: { type: String },

  isDeleted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  activeStatus: { type: Boolean, default: true },
  reason: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Vendor = model("Vendor", vendorSchema);
module.exports = Vendor;
