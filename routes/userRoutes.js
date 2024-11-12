const ctrl = require("../controllers/userController");
const { auth_admin, auth_customer, auth_all } = require("../middlewares/auth");
const express = require("express");
const role = require("../middlewares/role");
const router = express.Router();

router.post("/customer/register", ctrl.registerCustomer);
router.post("/customer/login", ctrl.loginCustomer);

router.post("/admin/create", auth_admin, role("admin"), ctrl.createUser);
router.post("/admin/login", ctrl.loginAdmin);



router.get("/profile", auth_all, ctrl.getProfile);
router.post("/profile/udpate", auth_all, ctrl.updateInfo);
router.post("/profile/udpatePas", auth_all, ctrl.updatePassword_customer);

router.get("/admin/getAll", auth_admin, role("admin"), ctrl.getAll);
router.get("/admin/getCustomers", auth_admin, role("admin"), ctrl.getCustomers);
router.post("/admin/getOne", auth_admin, role("admin"), ctrl.getOne);
router.post("/admin/deleteOne", auth_admin, role("admin"), ctrl.deleteOne);
router.post(
  "/admin/changePasswordOfUser",
  auth_admin,
  role("admin"),
  ctrl.changePasswordOfUser
);
router.post("/admin/udpateProfile", auth_admin, ctrl.updateInfoAdmin);

module.exports = router;

