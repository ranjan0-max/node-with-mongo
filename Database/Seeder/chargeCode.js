const mongoose = require("mongoose");
require("dotenv").config();

const ChargeCode = require("../Models/chargeCode.model");
const { connection } = require("../connection");
const { IST } = require("../../Helpers/dateTime.helper");

const data = [
  {
    chargeCode: "TRPT-INT11",
    description: "For Inter Branch Billing",
    chargeCodeActive: true,
    vat: 0,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    chargeCode: "EXPSTD11",
    description: "For All Charges with 5 % VAT",
    chargeCodeActive: true,
    vat: 5,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    chargeCode: "EXPZERO11",
    description: "For All Charges with 0 % VAT",
    chargeCodeActive: true,
    vat: 0,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    chargeCode: "EXPREIM11",
    description:
      "For All ' As per reciepts Charges'. Charges paid without margin on behalf of customer. Eg: Customs Duty, Border Charges etc",
    chargeCodeActive: true,
    vat: 0,
    created_at: IST(),
    updated_at: IST(),
  },
];

const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    ChargeCode.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    ChargeCode.insertMany(data, (error, docs) => {
      if (error) console.log(error);
      else console.log("DB seed complete");
      process.exit();
    });

    console.log("running seeder !");
  } catch (error) {
    console.log("Error seeding DB :: ", error?.message);
    process.exit();
  }
};

init(data);
