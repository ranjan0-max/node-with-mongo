const { Schema, model } = require('mongoose');
const USER = 'User';
const SITE = 'Site';
const FIELD_EXECUTIVE = 'FieldExecutive';
const SEGMENT = 'Segment';

const fmlSchema = new Schema(
    {
        siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
        userId: { type: Schema.Types.ObjectId, ref: USER, index: true },
        madeBy: { type: Schema.Types.ObjectId, ref: USER, index: true },
        assignor: { type: Schema.Types.ObjectId, ref: USER },
        enquiryNumber: { type: String },
        customerName: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        preBookingNo: { type: String, required: true, unique: true }, //  i.e -- PB-00000001
        bookingMadeDate: { type: Date, required: true },
        pickUpTimeFrom: { type: String },
        pickUpTimeTo: { type: String },
        shipper: { type: Schema.Types.ObjectId, ref: 'Customer' },
        shipperContact: { type: String },
        contactPerson: { type: String },
        mobile: { type: String },
        email: { type: String },
        product: { type: Schema.Types.ObjectId, ref: 'CargoDescription' },
        cod: { type: Number, default: 0 },
        remarks: { type: String },
        address: { type: String, required: true },
        googleMapAddress: { type: String },
        fieldExecutive: { type: Schema.Types.ObjectId, ref: FIELD_EXECUTIVE },
        vehicle: { type: String },
        vehicleNumber: { type: String },
        status: { type: String }, // ASSIGNED,RE_ASSIGNED REACHED, PICKED, WAREHOUSE_IN, CANCELLED
        assignedTime: { type: Date },
        collectionPicture: { type: Array },
        paymentCollected: { type: Boolean, default: false },
        rejectedReason: { type: String },
        warehouseApprovalManager: { type: String },
        totalNoOfPackagesToCollect: { type: Number, default: 0 },
        totalNoOfPackagesCollected: { type: Number, default: 0 },
        packageAssignData: { type: Array },
        segment: { type: Schema.Types.ObjectId, ref: SEGMENT },
        dimensionDetail: { type: Array },
        attachments: { type: Array },
        wareHouseLocation: { type: Schema.Types.ObjectId },
        orderType: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date }
    },
    {
        index: { siteId: 1, userId: 1 },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

fmlSchema.virtual('logs', {
    ref: 'FirstMilePickupStatus',
    localField: 'preBookingNo',
    foreignField: 'fmlBookingNumber',
    justOne: false,
    options: { sort: { created_at: -1 } }
});

const FirstMilePickup = model('FirstMilePickup', fmlSchema);
module.exports = FirstMilePickup;
