const express = require("express");
const router = express.Router();
const diemController = require("../controller/diemController");

router.post("/insert", diemController.insert);
router.get("/all", diemController.all);
router.get("/dell", diemController.dell);

module.exports = router;
