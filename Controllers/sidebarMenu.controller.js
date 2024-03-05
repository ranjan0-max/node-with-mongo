const SidebarMenu = require("../Database/Models/sidebarMenu.model");
const Menu = require("../Database/Models/menu.model");
const User = require("../Database/Models/user.model");
const Response = require("../Helpers/response.helper");
const DateTime = require("../Helpers/dateTime.helper");
const Logger = require("../Helpers/logger");
const { generateCustomError } = require("../Helpers/error.helper");
const DB = require("../Helpers/crud.helper");
const controllerName = "sidebarMenu.controller.js";

/**
 * @description GET ALL SideBar menus
 * @param model mongoose SidebarMenu model && Menu
 * @param data string: Request.body req.query.auth_user_id,
 * @returns object: { success: boolean, error: boolean || error }
 */
const getAllSideBarMenu = async (req, res, next) => {
  try {
    const userConfigMenus = await SidebarMenu.find({
      user_id: req.query.auth_user_id,
    });

    const allMenus = await Menu.find();
    const setMenuKey = (menu) => {
      if (userConfigMenus[0]?.config.includes(menu.id)) menu.accesss = true;
      else return;
      if (menu?.children && menu.children.length) {
        menu.children = menu.children.filter(setMenuKey);
      }
      return menu;
    };
    const userMenu = allMenus.filter(setMenuKey);
    const sidebar = {};
    userMenu.map((menu) => (sidebar[menu.id] = menu));

    if (Object.keys(sidebar).length > 0) {
      return Response.success(res, {
        data: sidebar,
        count: Object.keys(sidebar).length,
        message: "Config Founds",
      });
    } else {
      return Response.success(res, {
        data: [],
        message: "No Config Founds",
      });
    }
  } catch (error) {
    console.log(error);
    Logger.error(
      error.message + "at getAllSideBarMenu function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};
// Set User Config Post And Save
const postSideBarMenu = async (req, res, next) => {
  try {
    // Create Side Bar MenuAPi
    await DB.isUnique(SidebarMenu, { user_id: req.body.user_id });
    const sidebarMenuData = {
      user_id: req.body.user_id,
      config: req.body?.config,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };
    await DB.create(SidebarMenu, sidebarMenuData);

    const UserData = {
      configStatus: true,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };
    const myquery = { _id: req.body.user_id };
    await DB.update(User, { data: UserData, query: myquery });
    return Response.success(res, {
      data: sidebarMenuData,
      message: "Config Set SuccessFully",
    });
  } catch (error) {
    Logger.error(
      error.message + "at postSideBarMenu function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

// Set User Config put and save

const updateMenu = async (req, res, next) => {
  try {
    const myquery = { user_id: req.params.id };
    const data = {
      ...req.body,
      created_at: DateTime.IST("database"),
      updated_at: DateTime.IST("database"),
    };
    await DB.CustomUpdate(SidebarMenu, { data, query: myquery });
    return Response.success(res, {
      data: [data],
      message: "Config Updated !",
    });
  } catch (error) {
    Logger.error(error.message + "at updateMenu function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

//\\----------------------- Get All Selected Or Not Selected Menu For Given Id Use -----------------------\\//
const getUserConfigMenus = async (req, res, next) => {
  try {
    const userConfigMenus = await SidebarMenu.find({ user_id: req.params.id });

    const allMenus = await Menu.find();

    const setMenuKey = (menu) => {
      if (userConfigMenus[0]?.config.includes(menu.id)) menu.accesss = true;
      else return;
      if (menu?.children && menu.children.length) {
        menu.children = menu.children.filter(setMenuKey);
      }
      return menu;
    };
    const userMenu = allMenus.filter(setMenuKey);
    const sidebar = {};
    userMenu.map((menu) => (sidebar[menu.id] = menu));

    if (Object.keys(sidebar).length > 0) {
      return Response.success(res, {
        data: sidebar,
        count: Object.keys(sidebar).length,
        message: "Config Found",
      });
    } else {
      return Response.success(res, {
        data: [],
        message: "No Config Found",
      });
    }
  } catch (error) {
    Logger.error(
      error.message + "at getUserConfigMenus function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  getAllSideBarMenu,
  postSideBarMenu,
  getUserConfigMenus,
  updateMenu,
};
