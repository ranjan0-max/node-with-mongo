const mongoose = require("mongoose");
require("dotenv").config();
const { IST } = require("../../Helpers/dateTime.helper");
const Role = require("../Models/role.model");
const { connection } = require("../connection");

// seeder data here

const data = [
  {
    id: 1,
    role: "SUPER_ADMIN",
    role_active: true,
    priority: 1,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 2,
    role: "SITE_ADMIN",
    role_active: true,
    priority: 2,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 3,
    role: "SALE_MANAGER",
    role_active: true,
    priority: 3,
    created_at: IST(),
    updated_at: IST(),
  },

  {
    id: 4,
    role: "WAREHOUSE_MANAGER",
    role_active: true,
    priority: 4,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 5,
    role: "ACCOUNT_MANAGER",
    role_active: true,
    priority: 5,

    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 6,
    role: "OPERATION_MANAGER",
    role_active: true,
    priority: 6,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 7,
    role: "SUPERVISOR",
    role_active: true,
    priority: 7,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 8,
    role: "CUSTOMER",
    role_active: true,
    priority: 8,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 9,
    role: "LOADER",
    role_active: true,
    priority: 9,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 10,
    role: "DRIVER",
    role_active: true,
    priority: 10,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 11,
    role: "FIELD_EXECUTIVE",
    role_active: true,
    priority: 11,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 12,
    role: "SALEMAN",
    role_active: true,
    priority: 12,
    created_at: IST(),
    updated_at: IST(),
  },
  {
    id: 13,
    role: "WAREHOUSE_EXECUTIVE",
    role_active: true,
    priority: 13,
    created_at: IST(),
    updated_at: IST(),
  },
];
const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    Role.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    Role.insertMany(data, (error, docs) => {
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
