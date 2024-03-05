const mongoose = require("mongoose");
require("dotenv").config();

const SearchItem = require("../Models/searchItem.model");
const { connection } = require("../connection");

// seeder data here
const data = [
  { id: "country", search_key: "Country", path: "/masters/country" },
  // { id: 'State',search_key: 'state', path: '/masters/state' },
  // { id: 'division', search_key: 'Division', path: '/masters/division' },
  { id: "site", search_key: "Site", path: "/masters/site" },
  { id: "customers", search_key: "Customers", path: "/masters/customers" },
  { id: "vendor", search_key: "vendor", path: "/masters/vendor" },
  { id: "reasons", search_key: "Reasons", path: "/masters/reasons" },
  { id: "currency", search_key: "Currency", path: "/masters/currency" },
  { id: "service", search_key: "Service", path: "/masters/service" },
  { id: "chargeCode", search_key: "Charge Code", path: "/masters/chargeCode" },
  { id: "users", search_key: "Users", path: "/masters/users" },
  {
    id: "userMapping",
    search_key: "SaleMangerMapping",
    path: "/masters/mapping-salemanager-saleman",
  },
  {
    id: "fieldExcutive",
    search_key: "Field Executive",
    path: "/masters/fieldExecutive",
  },

  { id: "enquiry", search_key: "Enquiry", path: "/sales/enquiry" },
  { id: "lead", search_key: "Lead", path: "/sales/lead" },
  {
    id: "kanbanBoard",
    search_key: "Kanban Board",
    path: "/sales/enquiryBoard",
  },

  {
    id: "quotation_list",
    search_key: "Quotation List",
    path: "/sales/quotation",
  },

  {
    id: "fmlPickups",
    search_key: "First Mile Pickup",
    path: "/firstMilePickup",
  },
];

const init = async (data) => {
  try {
    console.log("running seeder !");
    connection();
    SearchItem.deleteMany({}, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log("adding seeder record/s !");
    SearchItem.insertMany(data, (error, docs) => {
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
