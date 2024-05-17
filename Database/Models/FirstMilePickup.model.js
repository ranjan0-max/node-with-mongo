const { Schema, model } = require("mongoose");
const USER = "User";
const SITE = "Site";
const FIELD_EXECUTIVE = "FieldExecutive";
const SEGMENT = "Segment";

const fmlSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
    userId: { type: Schema.Types.ObjectId, ref: USER, index: true },
    enquiryNumber: { type: String },
    customerName: { type: String, required: true },
    preBookingNo: { type: String, required: true, unique: true }, //  i.e -- PB-00000001
    bookingMadeDate: { type: Date, required: true },
    pickUpTimeFrom: { type: String, required: true },
    pickUpTimeTo: { type: String, required: true },
    shipper: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    product: { type: String, required: true },
    cod: { type: Number },
    remarks: { type: String },
    address: { type: String, required: true },
    googleMapAddress: { type: String },
    fieldExecutive: { type: Schema.Types.ObjectId, ref: FIELD_EXECUTIVE },
    vehicle: { type: String },
    vehicleNumber: { type: String },
    status: { type: String }, // ASSIGNED,RE_ASSIGNED REACHED, PICKED, WAREHOUSE_IN, CANCELLED
    assignedTime: { type: Date },
    collectionPicture: { type: String },
    paymentCollected: { type: Boolean, default: false },
    rejectedReason: { type: String },
    warehouseApprovalManager: { type: String },
    totalNoOfPackagesToCollect: { type: Number, default: 0 },
    totalNoOfPackagesCollected: { type: Number, default: 0 },
    packageAssignData: { type: Array },
    segment: { type: Schema.Types.ObjectId, required: true, ref: SEGMENT },
    dimensionDetail: { type: Array },
    wareHouseLocation: { type: Schema.Types.ObjectId },
    orderType: { type: String },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  { index: { siteId: 1, userId: 1 } }
);

const FirstMilePickup = model("FirstMilePickup", fmlSchema);
module.exports = FirstMilePickup;
