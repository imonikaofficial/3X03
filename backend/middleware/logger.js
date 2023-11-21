const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const { env } = require("process");
const fsPromises = fs.promises;

const logEvents = async (logItem, logFilePath) => {
  try {
    await fsPromises.appendFile(logFilePath, logItem);
  } catch (err) {
    console.error("Error writing to the log file:", err);
  }
};

const logger = (req, res, next) => {
  const logFilePath = "/var/log/access.log"; // Desired log file path
  // Store the original res.end method to intercept it later
  const originalEnd = res.end;
  const { headers, connection } = req;
  const remoteAddress = connection.remoteAddress;
  const timestamp = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const method = req.method;
  const url = req.url;
  const statusCode = res.statusCode;
  const referer = headers.referer || "-";
  const userAgent = headers["user-agent"];
  const uid = uuid();
  // console.log(req);
  let logEntry = `${uid} / ${remoteAddress} - - [${timestamp}] "${method} ${url} HTTP/1.1" ${statusCode} "${referer}" "${userAgent}"\n`;

  // Create a function to intercept and log the response data
  res.end = function (data, encoding) {
    // Log the response status code
    console.log(`Response Status Code: ${res.statusCode}`);
    let userId = "-";
    // Check if 'Id' is present in the request body
    if (req.body._id || req.id) {
      userId = req.body._id || req.id;
      console.log("User ID:", userId);
    }

    logEntry = `${uid} ${res.statusCode} ${userId.toString()}\n`;
    logEvents(logEntry, logFilePath);

    // Call the original res.end method to finish the response
    originalEnd.call(res, data, encoding);
  };

  // Log the request

  logEvents(logEntry, logFilePath);
  next();
};

module.exports = { logEvents, logger };
