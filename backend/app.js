require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbConn");
const transporter = require("./middleware/mailer");

//required routing
const mongoRoutes = require("./routes/routes");

const port = process.env.PORT || 5001;

console.log(process.env.NODE_ENV);

// database connection
connectDb();

const app = express();
app.use(logger);

app.use(express.json({ limit: "5mb", extended: true }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(errorHandler);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("nodeMailer is ready");
  }
});

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

app.use("/api", mongoRoutes);
