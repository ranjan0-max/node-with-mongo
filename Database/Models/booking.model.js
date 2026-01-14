const { Schema, model } = require('mongoose');
const USER = 'User';
const SITE = 'Site';
const CUSTOMER = 'Customer';

const bookingSchema = new Schema(
    {
        bookingNumber: { type: String, required: true, unique: true },
        awbNumber: { type: String, required: true, unique: true },
        enquiryNumber: { type: String },
        preBookingNumber: { type: String },
        customerEmail: { type: String, required: true },
        customerMobile: { type: String, required: true },
        origin: { type: String, required: true },
        destination: { type: String, required: true },
        mode: { type: String, required: true },
        pickupRequired: { type: String, required: true },
        deliveryRequired: { type: String, required: true },
        segment: { type: Schema.Types.ObjectId, ref: 'Segment' },
        shipmentTerm: { type: String, required: true },
        shipmentDate: { type: Date, required: true },
        freight: { type: String, required: true },
        shipperAddress: { type: String, required: true },
        shipperCountry: { type: String, required: true },
        shipperMobileNumber: { type: String, required: true },
        shipperEmail: { type: String, required: true },
        consigneeAddress: { type: String, required: true },
        consigneeCountry: { type: String, required: true },
        consigneeMobileNumber: { type: String, required: true },
        consigneeEmail: { type: String, required: true },
        billingCustomerAddress: { type: String, required: true },
        billingCustomerCountry: { type: String, required: true },
        billingCustomerMobileNumber: { type: String, required: true },
        billingCustomerEmail: { type: String, required: true },
        hazardous: { type: String },
        stackAble: { type: String },
        cargoDescription: { type: String, required: true },
        commodityDescription: { type: String, required: true },
        billingCustomerName: {
            type: Schema.Types.ObjectId,
            ref: CUSTOMER,
            required: true
        },
        shipperName: {
            type: Schema.Types.ObjectId,
            ref: CUSTOMER,
            required: true
        },
        consigneeName: {
            type: Schema.Types.ObjectId,
            ref: CUSTOMER,
            required: true
        },
        customerName: {
            type: Schema.Types.ObjectId,
            ref: CUSTOMER,
            required: true
        },
        status: { type: String },
        showEditButton: { type: Boolean, default: true },
        dimensionDetail: { type: Array },
        financeTable: { type: Array },
        siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
        userId: { type: Schema.Types.ObjectId, ref: USER, index: true },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true }
    },
    { index: { siteId: 1, userId: 1 } }
);

bookingSchema.virtual('customer', {
    ref: 'Customer',
    localField: 'customerName',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('shipper', {
    ref: 'Customer',
    localField: 'shipperName',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('consignee', {
    ref: 'Customer',
    localField: 'consigneeName',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('billingCustomer', {
    ref: 'Customer',
    localField: 'billingCustomerName',
    foreignField: '_id',
    justOne: true
});

const Booking = model('Booking', bookingSchema);
module.exports = Booking;
