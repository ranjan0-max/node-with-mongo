const { Schema, model } = require("mongoose");
const {
  PENDING,
  EMPTY,
  PALLETIZATION_PENDING,
} = require("../../Constant/constant");

const bookingItemSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: "Site" },
    bookingNumber: { type: String, required: true, index: true },
    awbNumber: { type: String, required: true, index: true },
    destination: { type: String, required: true },
    qrCode: { type: String, unique: true },
    packageType: { type: String, required: true },
    packageNumber: { type: Number, required: true },
    qcStatus: { type: String, default: PENDING, index: true },
    storageLocation: { type: String, default: EMPTY },
    loadListNumber: { type: String, default: EMPTY, index: true },
    dePalletizationStatus: { type: Boolean, default: false },
    palletNumber: {
      type: String,
      index: true,
      default: PALLETIZATION_PENDING,
    },
    status: { type: String, default: EMPTY, index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
  },
  {
    index: {
      awbNumber: 1,
      palletNumber: 1,
      bookingNumber: 1,
      qcStatus: 1,
      loadListNumber: 1,
      status: 1,
    },
  }
);

const BookingItem = model("BookingItem", bookingItemSchema);
module.exports = BookingItem;
