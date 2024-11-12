const express = require("express");
const ctrl = require("../controllers/notificationController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const router = express.Router();
router.get("/getForUsrUnread", auth.auth_all,  ctrl.getForUsrUnread);
router.get("/getForUser", auth.auth_all,  ctrl.getForUsr);
router.get("/markAsRead", auth.auth_all,  ctrl.markAsRead);



router.get("/admin/notificationsSent", auth.auth_admin, role("admin"), ctrl.notificationsSent);
router.post("/admin/delete", auth.auth_admin, role("admin"), ctrl.deleteOneFromAdmin);
router.post("/admin/sendNotToCustomer", auth.auth_admin, role("admin"), ctrl.create);






module.exports = router;
