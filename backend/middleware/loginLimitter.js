const rateLimit = require("express-rate-limit");
const { logEvents } = require("../middleware/logger");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const loginLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: handleRateLimitExceeded, // Custom handler function for when rate limit is exceeded
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom handler function for when rate limit is exceeded
function handleRateLimitExceeded(req, res, options) {

  const { headers, connection } = req;
  const remoteAddress = connection.remoteAddress;
  const timestamp = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const method = req.method;
  const url = req.url;
  const statusCode = res.statusCode;
  const contentLength = res.getHeader('content-length');
  const referer = headers.referer || '-';
  const userAgent = headers['user-agent'];
  const message = `Too many login attempts, please try again after 15 minutes`;
  const logFilePath = '/var/log/access.log';
  logEvents(
    `${uuid()} / ${remoteAddress} - - [${timestamp}] "${method} ${url} HTTP/1.1" ${statusCode} ${contentLength} "${referer}" "${userAgent}" "Too many login attempts"\n`,
    logFilePath
  );
  res.status(429).json({
    status: 429,
    message: message,
  });
}

module.exports = loginLimitter;
