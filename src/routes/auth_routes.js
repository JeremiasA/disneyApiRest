const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/auth_controllers"),
  { validate_userName, validate_email } = require("../middlewares/users_validations");

router.post("/login", controller.login);
router.post("/register", validate_userName, validate_email, controller.register);

module.exports = router;
