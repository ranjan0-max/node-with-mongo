const mongoose = require("mongoose");
require("dotenv").config();

const Segment = require("../Models/segment.model");
const { connection } = require("../connection");
const { IST } = require("../../Helpers/dateTime.helper");

const data = [
  {
    code: "AE",
    name: "AIR EXPORT",
    classification: "AIR",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "AI",
    name: "AIR IMPORT",
    classification: "AIR",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "AX",
    name: "AIR CROSS TRADE",
    classification: "AIR",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "IA",
    name: "AIR IMPORT FREIGHT AND CLEARANCE",
    classification: "AIR",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "OO",
    name: "ALL SEGMENT",
    classification: "ALL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "AC",
    name: "AIR IMPORT CLEARANCE",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "OF",
    name: "LAND EXPORT CLEARANCE",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "OL",
    name: "LAND IMPORT CLEARANCE",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "SF",
    name: "SEA FCL IMPORT CLEARANCE",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "SC",
    name: "SEA LCL IMPORT CLEARANCE",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "CS",
    name: "LCL EXPORT CLEARANCE (SEA)",
    classification: "CLEARANCE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "TE",
    name: "FTL EXPORT (LAND)",
    classification: "FTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "TI",
    name: "FTL IMPORT (LAND)",
    classification: "FTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "LX",
    name: "OTHERS TRUCKING SERVICES",
    classification: "FTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "LD",
    name: "LOCAL DELIVERY",
    classification: "LTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "OI",
    name: "LTL IMPORT (LAND)",
    classification: "LTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "OE",
    name: "LTL EXPORT (LAND)",
    classification: "LTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "LE",
    name: "LCL EXPORT (SEA)",
    classification: "LTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "LI",
    name: "LCL IMPORT (SEA)",
    classification: "LTL",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "SE",
    name: "FCL EXPORT (SEA)",
    classification: "SEA",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "SI",
    name: "FCL IMPORT (SEA)",
    classification: "SEA",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "ES",
    name: "SEA EXPORT FREIGHT AND CLEARANCE",
    classification: "SEA",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "SX",
    name: "SEA CROSS TRADE",
    classification: "SEA",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "IS",
    name: "SEA IMPORT FREIGHT AND CLEARANCE",
    classification: "SEA",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "WV",
    name: "WAREHOUSE",
    classification: "WAREHOUSE",
    created_at: IST(),
    updated_at: IST(),
  },
  {
    code: "WS",
    name: "WAREHOUSE STORAGE",
    classification: "WAREHOUSE",
    created_at: IST(),
    updated_at: IST(),
  },
];

const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    Segment.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    Segment.insertMany(data, (error, docs) => {
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
