const { Schema, model } = require("mongoose");
const qualityCheckSchema = new Schema({
  bookingNumber: { type: String, required: true, unique: true },
  units: { type: Number },
  piecesStatus: [
    {
      pieces: { type: String },
      status: { type: String },
    },
  ],
  siteId: { type: Schema.Types.ObjectId, ref: "Site" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const QualityCheck = model("QualityCheck", qualityCheckSchema);
module.exports = QualityCheck;
