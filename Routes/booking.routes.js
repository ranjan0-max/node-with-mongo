const express = require("express");
const BookingController = require("../Controllers/booking.controller");
const router = express.Router();
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
  .get("/", BookingController.getAllBooking)
  .post("/", authJwt, BookingController.createBooking)
  .put("/:id", authJwt, BookingController.updateBooking)
  .get("/search/:id", BookingController.getBookingDetail)
  .get("/searchLog/:id", BookingController.getBookingLog)
  .post("/sendConsignment", BookingController.getConsignmentNote);

module.exports = router;
