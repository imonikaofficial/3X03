const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // await mongoose.connect(process.env.ATLAS_URI);
    // const db = mongoose.connection.db;
    const mongoHostname = process.env.MONGO_HOSTNAME;
    const mongoPort = process.env.MONGO_PORT;
    const mongoDb = process.env.MONGO_DB;
    const mongoUser = process.env.MONGO_USERNAME;
    const mongoPass = process.env.MONGO_PASSWORD;

    const authenticationDatabase = "admin"; // Specify the authentication database


    const useTLS = true; // Always use TLS for this setup
    const allowInvalidCertificates = true; // Allow invalid certificates

    const tlsOptions = {
      tls: true,
      tlsAllowInvalidCertificates: allowInvalidCertificates,
    };

    const connectionString = `mongodb://${mongoUser}:${mongoPass}@${mongoHostname}:${mongoPort}/${mongoDb}?authSource=${authenticationDatabase}`;
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...tlsOptions, // Include TLS options
    });
    // await mongoose.connect(connectionString);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.error(error);
  }
};

module.exports = connectDb;
