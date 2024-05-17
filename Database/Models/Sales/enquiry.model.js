const { Schema, model } = require("mongoose");
const PENDING = "PENDING";
const USER = "User";
const SITE = "Site";

const enquiry_schema = new Schema(
  {
    enquiry_number: { type: String, required: true, unique: true },
    customer_name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    total_weight: { type: Number, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    mode: { type: String, required: true },
    pickupRequired: { type: String, required: true },
    deliveryRequired: { type: String, required: true },
    shipmentDate: { type: Date, required: true },
    shipmentTerm: { type: String, required: true },
    freight: { type: String, required: true },
    cargoDescription: { type: String },
    cargoInvoiceValue: { type: Number, required: true },
    enquiry_status: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String },
    dimensionDetail: { type: Array },
    selfApproval: { type: Boolean, default: false },
    reason: { type: String },
    attachment: [
      {
        fileType: { type: String },
        fileName: { type: String },
        link: { type: String, default: null },
      },
    ],
    priceApprove: { type: Boolean, default: false },
    approvalManager: { type: String },
    quotationMade: { type: Boolean, default: false },
    bookingMade: { type: Boolean, default: false },
    approvalStatus: { type: String, default: PENDING },
    contactPerson: { type: String },
    quotationApprove: { type: Boolean, default: false },
    remark: { type: String },
    quotation: { type: Number },
    segment: { type: Schema.Types.ObjectId, required: true },
    siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true,
      index: true,
    },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  { index: { siteId: 1, userId: 1 } }
);

const Enquiry = model("Enquiry", enquiry_schema);
module.exports = Enquiry;
