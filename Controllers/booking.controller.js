const Response = require('../Helpers/response.helper');
const Logger = require('../Helpers/logger');
const DateTime = require('../Helpers/dateTime.helper');
const DB = require('../Helpers/crud.helper');
const NumberGenerator = require('../Helpers/numberGenerator.helper');
const controllerName = 'booking.controller.js';
const { makeBookingLog, readBookingLog } = require('../Helpers/dbLog.helper');
const { handleError } = require('../Helpers/error.helper');

const mongoose = require('mongoose');
const User = require('../Database/Models/user.model');
const Booking = require('../Database/Models/booking.model');
const FtlBooking = require('../Database/Models/ftlBooking.model');
const BookingItem = require('../Database/Models/bookingItem.modal');
const Enquiry = require('../Database/Models/Sales/enquiry.model');
const FirstMilePickup = require('../Database/Models/FirstMilePickup.model');

const {
    ONE,
    ZERO,
    PENDING,
    EMPTY,
    RETURN,
    HOLD,
    APPROVED,
    BOOKED,
    TEN,
    THREE,
    DATE,
    QC_STATUS_ARRAY,
    BASE_64,
    ENQUIRY,
    FML,
    BOOKING_CREATED
} = require('../Constant/constant');
const COMMA = ',';

const ConsignmentNoteMailTemplate = require('../Helpers/emailTemplates/consignmentNoteMailTemplate');
const SendEmail = require('../Helpers/email.helper');
let isBookingTableLocked = false;

// -=-=-=-=-=-=-=-=-=-=-=- making bookingItems of booking =-=-=-=-=-=-=-=-=-=-=-=-

const insertDataInBookingItem = async (data) => {
    var dataToInsert = [];
    var pktNumber = ONE;
    let totalNoOfPackage = ZERO;

    if (data.table.length) {
        data.table.forEach((packageData) => {
            totalNoOfPackage += parseInt(packageData.noOfPackage, TEN);
        });

        for (let row = ZERO; row < data.table.length; row++) {
            for (let pkt = ZERO; pkt < data.table[row].noOfPackage; pkt++) {
                dataToInsert.push({
                    siteId: data.siteId,
                    bookingNumber: data.bookingNumber,
                    qrCode: `${data.bookingNumber}-${data.table[row].packageType.slice(ZERO, THREE)}-(${pktNumber}/${totalNoOfPackage})`,
                    awbNumber: data.awbNumber,
                    packageType: data.table[row].packageType,
                    packageNumber: pktNumber,
                    qcStatus: PENDING,
                    storageLocation: EMPTY,
                    destination: data.destination,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                pktNumber += ONE;
            }
        }
        BookingItem.insertMany(dataToInsert, (error, docs) => {
            if (error) {
                Logger.error('Error at insertDataInBookingItem function ' + controllerName, error, error);
                return Response.error(res, {
                    data: [],
                    message: 'Something wet wrong in booking item'
                });
            } else {
            }
        });
    }
};

// -=-=-=-=-=-=-=-=-=-=-=- update the status of origin of booking =-=-=-=-=-=-=-=-=-

const updateTheStatusOriginOfBooking = async (bookingOrigin, id) => {
    try {
        if (bookingOrigin === ENQUIRY) {
            const enquiryData = {
                enquiry_status: BOOKED,
                updated_at: new Date()
            };
            const enquiryQuery = { enquiry_number: id };
            await DB.updateOne(Enquiry, { query: enquiryQuery, data: enquiryData });
        } else if (bookingOrigin === FML) {
            const fmlData = {
                status: BOOKING_CREATED,
                updated_at: new Date()
            };
            const fmlQuery = { preBookingNo: id };
            await DB.updateOne(FirstMilePickup, { query: fmlQuery, data: fmlData });
        }
    } catch (error) {
        Logger.error('Error at updateTheStatusOriginOfBooking function ' + controllerName, error, error);
    }
};

// create booking
const createBooking = async (req, res, next) => {
    const maxRetries = 10; // Maximum number of retries
    const retryInterval = 500; // Milliseconds to wait between retries

    let retries = 0;

    // Define a function to wait for the booking table to become available
    const waitForBookingTable = async () => {
        while (isBookingTableLocked && retries < maxRetries) {
            // If the booking table is locked, wait for a short interval and then retry
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
            retries++;
        }
    };
    try {
        await waitForBookingTable();

        if (isBookingTableLocked) {
            // If it's locked, return an error response
            return Response.badRequest(res, {
                data: [],
                message: 'Booking table is currently locked. Please try again later.'
            });
        }

        isBookingTableLocked = true;

        const data = {
            ...req.body,
            bookingNumber: await NumberGenerator.generateBookingNumber(),
            status: BOOKED,
            created_at: new Date(),
            updated_at: new Date()
        };

        const modifierName = await DB.readOne(User, {
            _id: req.query.auth_user_id
        });
        await makeBookingLog({
            refNumber: data.bookingNumber,
            detailDescription: 'Shiment Booked SuccessFully!',
            status: data.status,
            functionName: 'createBooking',
            modifierName: modifierName.name || 'ADMIN',
            created_at: new Date(),
            updated_at: new Date()
        });

        await DB.create(Booking, data);

        isBookingTableLocked = false;

        insertDataInBookingItem({
            bookingNumber: data.bookingNumber,
            table: data.dimensionDetail,
            siteId: data.siteId,
            awbNumber: data.awbNumber,
            destination: data.destination
        });

        if (req.body.enquiryNumber) {
            updateTheStatusOriginOfBooking(ENQUIRY, req.body.enquiryNumber);
        } else if (req.body.preBookingNumber) {
            updateTheStatusOriginOfBooking(FML, req.body.preBookingNumber);
        }

        // handleSocketCallOn(true);
        // if (socketCall) {
        //   io.to(123).emit("refetchApi", { url: "/booking" });
        // }

        return Response.success(res, { data: data, message: 'Shipment Booked!' });
    } catch (error) {
        const message = handleError(error);
        isBookingTableLocked = false;
        Logger.error('Error  at createBooking function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// get all booking detail
const getAllBooking = async (req, res, next) => {
    try {
        const query = {
            ...req.query
        };

        if (req.query.siteId) {
            query.siteId = mongoose.Types.ObjectId(req.query.siteId);
        }

        if (req.query.userId) {
            query.userId = mongoose.Types.ObjectId(req.query.userId);
        }

        const bookings = await DB.aggregation(Booking, [
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerName',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'shipperName',
                    foreignField: '_id',
                    as: 'shipper'
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'consigneeName',
                    foreignField: '_id',
                    as: 'consignee'
                }
            }
        ]);
        return Response.success(res, {
            data: bookings
        });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at getAllBooking function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// update booking
const updateBooking = async (req, res) => {
    try {
        const myquery = { _id: req.params.id };

        const data = {
            ...req.body,
            updated_at: new Date()
        };

        // when updating booking check if destination and awbNumber change or not if change than update the booking item
        const bookingDetail = await DB.readOne(Booking, myquery);
        if (bookingDetail.destination !== data.destination || bookingDetail.awbNumber !== data.awbNumber) {
            const bookingItemData = {
                destination: req.body.destination,
                awbNumber: req.body.awbNumber
            };
            const query = {
                bookingNumber: bookingDetail.bookingNumber
            };
            DB.updateMany(BookingItem, { query, data: bookingItemData });
        }

        await DB.update(Booking, { data, query: myquery });
        return Response.success(res, {
            data: [],
            message: 'Booking Details Updated !'
        });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at updateBooking function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// ---------------------- get booking detail --------------------

const getBookingDetail = async (req, res) => {
    try {
        const myBookingQuery = { bookingNumber: req.params.id };
        const ftlBookingQuery = { bookingNumber: req.params.id };
        let bookingDetail;
        bookingDetail = await DB.readOne(Booking, myBookingQuery);
        if (!bookingDetail) {
            bookingDetail = await DB.readOne(FtlBooking, ftlBookingQuery);
        }
        return Response.success(res, { data: bookingDetail });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at getBookingDetail function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// ------------------- geting booking log useing awb number --------------------

const getBookingLog = async (req, res) => {
    try {
        const myRefQuery = { refNumber: req.params.id };
        const bookingLog = await readBookingLog(myRefQuery);
        return Response.success(res, {
            data: bookingLog,
            message: 'Booking Details Updated !'
        });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at getBookingLog function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// ----------------- sending consignment note to biilig customer ----------------------

const getConsignmentNote = async (req, res) => {
    try {
        const binaryData = Buffer.from(req.body.pdf.split(COMMA)[ONE], BASE_64);

        let attachment = {
            filename: `${req.body.consignementData.bookingNumber}.pdf`, // set the desired file name
            content: binaryData,
            encoding: BASE_64
        };

        let emailData = {
            to: req.body.toEmail,
            cc: 'vikas@coderootz.com',
            from: 'vikas@coderootz.com',
            subject: 'Consignment note',
            replyTo: 'analytics@threelineshipping.com',
            attachments: [attachment],
            html: ConsignmentNoteMailTemplate.ConsignmentNoteMailTemplate(req.body.consignementData)
        };
        try {
            await SendEmail.sendEmailWithNodemailer(req, res, emailData);
        } catch (error) {
            Logger.error('Error  at sending mail ' + controllerName, error);
        }
        return Response.success(res, {
            data: [],
            message: 'Consignment note send sucessfully'
        });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at getBookingLog function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

// ------------------- get booking detail for qc for mobile -------------------

const bookingForQcDataForMobile = async (req, res) => {
    try {
        const query = {
            conditions: {
                ...req.query
            }
        };
        const { conditions } = query;

        if (req.query.siteId && req.query.destination) {
            conditions.siteId = mongoose.Types.ObjectId(req.query.siteId);
        } else {
            return Response.badRequest(res, {
                data: [],
                message: 'SiteId & Destination is Required'
            });
        }

        const aggregationPipeline = [
            {
                $match: {
                    siteId: mongoose.Types.ObjectId(req.query.siteId),
                    destination: req.query.destination,
                    qcStatus: { $in: QC_STATUS_ARRAY }
                }
            },
            {
                $group: {
                    _id: '$bookingNumber',
                    totalBookingItems: { $sum: 1 },
                    destination: { $first: '$destination' },
                    pendingItems: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$qcStatus', PENDING] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    holdItems: {
                        $sum: {
                            $cond: { if: { $eq: ['$qcStatus', HOLD] }, then: 1, else: 0 }
                        }
                    },
                    returnItems: {
                        $sum: {
                            $cond: { if: { $eq: ['$qcStatus', RETURN] }, then: 1, else: 0 }
                        }
                    },
                    approvedItems: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$qcStatus', APPROVED] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'bookingNumber',
                    as: 'bookingDetail'
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'bookingDetail.customerName',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'bookingDetail.consigneeName',
                    foreignField: '_id',
                    as: 'consigneeInfo'
                }
            },
            {
                $match: {
                    'bookingDetail.status': req.query.filterStatus
                }
            },
            {
                $project: {
                    _id: 1,
                    created_at: { $arrayElemAt: ['$bookingDetail.created_at', 0] },
                    awbNumber: { $arrayElemAt: ['$bookingDetail.awbNumber', 0] },
                    orgin: { $arrayElemAt: ['$bookingDetail.origin', 0] },
                    bookingStatus: { $arrayElemAt: ['$bookingDetail.status', 0] },
                    totalBookingItems: 1,
                    destination: 1,
                    pendingItems: 1,
                    holdItems: 1,
                    returnItems: 1,
                    approvedItems: 1,
                    customerName: { $arrayElemAt: ['$customerInfo.customer_name', 0] },
                    consigneeName: { $arrayElemAt: ['$consigneeInfo.customer_name', 0] }
                }
            }
        ];

        const bookingDetail = await DB.aggregation(BookingItem, aggregationPipeline);

        return Response.success(res, {
            data: bookingDetail,
            message: 'Data found'
        });
    } catch (error) {
        const message = handleError(error);
        Logger.error('Error  at bookingForQcDataForMobile function ' + controllerName, error);
        return Response.error(res, {
            data: [],
            message: message
        });
    }
};

module.exports = {
    createBooking,
    getAllBooking,
    updateBooking,
    getBookingDetail,
    getBookingLog,
    getConsignmentNote,
    bookingForQcDataForMobile
};
