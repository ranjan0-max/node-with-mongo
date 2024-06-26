const { Schema, model } = require("mongoose");

const customerSchema = new Schema({
  customer_name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: { type: String },
  term_code: { type: String },
  mark: { type: String },
  customerType: { type: Array, required: true },

  //Address Details
  contactPersonEmail: { type: String },
  contactPersonName: { type: String },
  address_type: { type: String },
  address: { type: String, required: true },
  country: { type: String, required: true },
  landMark: { type: String },
  zip_code: { type: String },
  googleMapAddress: { type: String },

  //Vat Details
  vat_no: { type: String, required: true },
  vatExempted: { type: String },
  exempted_reason: { type: String },
  vat_doc: { type: String },

  //Trade Details
  license_no: { type: String, required: true },
  expiry_date: { type: Date },
  tradeExempted: { type: String },
  tradeExemptedReason: { type: String },
  trade_doc: { type: String },

  // credit limit Mapping
  creditLimitMapping: { type: Array },

  // sales Man Mapping
  salesManMapping: { type: Array },

  // account type mapping
  customerAccountTypeMapping: { type: Array },

  is_deleted: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
  active_status: { type: Boolean, default: false },
  reason: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  approvalStatus: { type: String, default: "PENDING" },
});

const Customer = model("Customer", customerSchema);
module.exports = Customer;
