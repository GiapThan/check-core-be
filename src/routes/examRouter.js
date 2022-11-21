const express = require("express");
const router = express.Router();
const examController = require("../controller/examController");

router.get("/:chuong/:lesson", examController.getBaiTap);
router.post("/create", examController.createBaiTap);
router.post("/signin", examController.signInBaiTap);
router.get("/all", examController.all);
router.get("/dell", examController.dell);

module.exports = router;
