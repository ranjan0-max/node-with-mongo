const mongoose = require("mongoose");
const SidebarMenu = require("../Models/sidebarMenu.model");
require("dotenv").config();
const DB = require("../../Helpers/crud.helper");
const User = require("../Models/user.model");
const { connection } = require("../connection");
const { IST } = require("../../Helpers/dateTime.helper");

const AuthHelper = require("../../Helpers/auth.helper");
const Logger = require("../../Helpers/logger");
const Role = require("../Models/role.model");
// seeder data here

const data = [
  {
    name: "SUPERADMIN",
    email: "superadmin@gmail.com",
    password: "secret",
    role: "",
    countryId: null,
    siteId: [],
    locationId: [],
    phoneNumber: 9876543210,
    activeStatus: true,
    configStatus: true,
    created_at: IST(),
    updated_at: IST(),
  },
];

const init = async (data) => {
  try {
    connection();
    const role = await DB.findDetails(Role, { role: "SUPER_ADMIN" });
    data[0].role = role[0]._id;
    data[0].password = await AuthHelper.generateHash(data[0].password);
    User.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });

    let user = await DB.create(User, data[0]);

    const configData = [
      {
        user_id: "",
        config: [
          "salesGroup",
          "salesCollapse",
          "approvedMenu",
          "bookingGroup",
          "masterGroup",
          "masterCollapse",
          "lead",
          "enquiry",
          "quotation",
          "kanban",
          "customerApproval",
          "priceApproval",
          "firstMileBookingItem",
          "country",
          "site",
          "division",
          "reasons",
          "customers",
          "vendor",
          "user",
          "chargeCode",
          "service",
          "currency",
          "pallet",
          "device",
          "fieldExecutive",
          "bookingItem",
          "bookingCollapse",
          "mappingSalemanagerSaleman",
          "segment",
          "qualityCheckItem",
          "storageLocation",
          "trackOfBooking",
          "loadList",
          "driver",
          "palletization",
          "exportjob",
          "importjob",
          "inbound",
          "mileStone",
          "lmdGroup",
          "lmdCollapse",
          "bookingForLmd",
          "ordersForLmd",
          "ftlbookingGroup",
          "ftlBookingCollapse",
          "ftlBooking",
          "ftlExportJob",
        ],
        created_at: IST(),
        updated_at: IST(),
      },
    ];

    Logger.error(JSON.stringify(user));
    configData[0].user_id = user[0]._id;

    SidebarMenu.insertMany(configData, (error, docs) => {
      if (error) {
        console.log(error);
        Logger.error(error.stack);
      } else console.log("DB seed complete");
      process.exit();
    });

    console.log("running seeder !");
  } catch (error) {
    console.log("Error seeding DB :: ", error?.message);
    process.exit();
  }
};

init(data);
