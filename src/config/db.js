const mongoose = require("mongoose");
async function connect() {
  try {
    const con = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(con.connection.host);
  } catch (error) {
    console.log(error);
    console.log("Connection failed");
  }
}
module.exports = { connect };
