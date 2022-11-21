const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/login", userController.login);
router.post("/login/name", userController.insertName);
router.get("/all", userController.all);
router.get("/dell", userController.dell);

module.exports = router;
