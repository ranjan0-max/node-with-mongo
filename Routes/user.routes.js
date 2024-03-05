const express = require("express");
const UserController = require("../Controllers/user.controller");
const router = express.Router();
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
  .get(
    "/wareHouseApprovalUser",
    authJwt,
    UserController.getWareHouseApprovalUser
  )

  .post("/", authJwt, UserController.createUser)
  .put("/:id", authJwt, UserController.updateUser)
  .get("/", authJwt, UserController.getAllUser)
  .get("/:id", authJwt, UserController.getSingleUserData)
  .get("/filter/activeUser", authJwt, UserController.getActiveUser)
  .get(
    "/filter/activeUserBySite",
    authJwt,
    UserController.getActiveUserBySiteAndRole
  )
  .get(
    "/salesMan/:saleManagerId",
    authJwt,
    UserController.getSalesManBySaleManager
  );

module.exports = router;
