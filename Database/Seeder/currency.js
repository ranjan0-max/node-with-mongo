const mongoose = require("mongoose");
require("dotenv").config();

const Currency = require("../Models/currency.model");
const { connection } = require("../connection");
const { IST } = require("../../Helpers/dateTime.helper");

const data = [
  {
    currencyName: "EURO",
    currencyCode: "EUR",
    currencyDate: "16-Feb-2023",
    sellRate: 4.1,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "BRITISH POUND",
    currencyCode: "GBP",
    currencyDate: "16-Feb-2023",
    sellRate: 4.7,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "US DOLLAR",
    currencyCode: "USD",
    currencyDate: "16-Feb-2023",
    sellRate: 3.685,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "UNITED ARAB EMIRATES DIRHAM",
    currencyCode: "AED",
    currencyDate: "25-Sep-2021",
    sellRate: 1,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "OMANI RIAL",
    currencyCode: "OMR",
    currencyDate: "20-Nov-2015",
    sellRate: 9.56,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "BAHRAINI DINAR",
    currencyCode: "BHD",
    currencyDate: "02-Apr-2015",
    sellRate: 9.73,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "SAUDI RIYAL",
    currencyCode: "SAR",
    currencyDate: "17-Dec-2014",
    sellRate: 0.98,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "QATARI RIAL",
    currencyCode: "QAR",
    currencyDate: "26-Jun-2023",
    sellRate: 1.01,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    currencyName: "KUWAITI DINAR",
    currencyCode: "KWD",
    currencyDate: "26-Jun-2023",
    sellRate: 11.94,
    activeStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
];

const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    Currency.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    Currency.insertMany(data, (error, docs) => {
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
