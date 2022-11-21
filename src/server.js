const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes");
const db = require("./config/db.js");
db.connect();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router(app);

app.listen(process.env.PORT || 8000, () => {
  console.log("start on port:", process.env.PORT || 8000);
});
