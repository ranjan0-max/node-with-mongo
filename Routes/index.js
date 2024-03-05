const authRoute = require("./auth.routes");
const roleRoute = require("./role.routes");
const locationRoute = require("./location.routes");
const stateRoute = require("./state.routes");
const countryRoute = require("./country.routes");
const reasonRoute = require("./reason.routes");
const SiteRoute = require("./site.routes");
const UserRoute = require("./user.routes");
const CustomersRoute = require("./customer.routes");
const FieldExecutiveRoute = require("./fe.routes");
const BranchRoute = require("./branch.routes");
const salesRoute = require("./sales.routes");
const sidebarMenusRoute = require("./sidebarMenus.routes");
const menusRoute = require("./menu.routes");
const chargeCode = require("./chargeCode.routes");
const serviceRoute = require("./service.routes");
const VendorRoute = require("./vendor.routes");
const CurrencyRoute = require("./currency.routes");
const firstMilePickupRoute = require("./firstMilePickup.routes");
const dashBoardRoute = require("./dashBoard.route");
// const fmlLogRoute = require("./fmlLog.routes");
const bookingRoute = require("./booking.routes");
const palletRoute = require("./pallet.routes");
const qualityCheckRoute = require("./qualityCheck.routes");
const segmentRoute = require("./segment.routes");
const mapSaleManagerToSaleMan = require("./mapSaleManagerToSaleMan.route");
const app = require("../app");

//! always remove  before pushing to server
function appRouter() {
  app.use("/v1/auth", authRoute);
  //\\ ==============================|| START: UI MASTERS ROUTES ||============================== //\\
  app.use("/v1/roles", roleRoute);
  app.use("/v1/locations", locationRoute);
  app.use("/v1/countries", countryRoute);
  app.use("/v1/states", stateRoute);
  app.use("/v1/reasons", reasonRoute);
  app.use("/v1/sites", SiteRoute);
  app.use("/v1/users", UserRoute);
  app.use("/v1/customers", CustomersRoute);
  app.use("/v1/fieldExecutives", FieldExecutiveRoute);
  app.use("/v1/branches", BranchRoute);
  app.use("/v1/sales", salesRoute);
  app.use("/v1/sidebar", sidebarMenusRoute);
  app.use("/v1/menu", menusRoute);
  app.use("/v1/chargeCode", chargeCode);
  app.use("/v1/service", serviceRoute);
  app.use("/v1/vendor", VendorRoute);
  app.use("/v1/currency", CurrencyRoute);
  app.use("/v1/firstMilePickup", firstMilePickupRoute);
  app.use("/v1/dashBoardData", dashBoardRoute);
  // app.use("/v1/fmlLog", fmlLogRoute);
  app.use("/v1/booking", bookingRoute);
  app.use("/v1/pallet", palletRoute);
  app.use("/v1/qualityCheck", qualityCheckRoute);
  app.use("/v1/segment", segmentRoute);
  app.use("/v1/mapSalemanagerToSaleman", mapSaleManagerToSaleMan);
  //\\ ==============================|| END: UI MASTERS ROUTES ||============================== //\\
}

module.exports = appRouter;
