const mongoose = require("mongoose");
require("dotenv").config();
const { IST } = require("../../Helpers/dateTime.helper");
const Pallet = require("../Models/pallet.model");
const { connection } = require("../connection");

// seeder data here

const data = [
  {
    palletNumber: "PLT-0000001",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000002",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000003",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000004",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000005",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000006",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000007",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000008",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000009",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    palletNumber: "PLT-0000010",
    active: true,
    created_at: IST(),
    updated_at: IST(),
  },
];
const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    Pallet.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    Pallet.insertMany(data, (error, docs) => {
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
