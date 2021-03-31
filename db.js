const { Client } = require('pg');


const { getDatabaseUri } = require("./config");

let DB_URI = getDatabaseUri();

let ssl;
if (DB_URI !== "postgresql:///paf") {
  ssl = {
    ssl: {
      rejectUnauthorized: false,
    },
  }
} else {
  ssl = null;
}

  const client = new Client({
    connectionString: DB_URI,
    ssl
  });

client.connect();

module.exports = client;