export class Database {
  public async connect() {
    const mongoose = require("mongoose");
    mongoose.connect(
      process.env.DB_CON,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log("con")
    );
  }
}
require("dotenv").config();
