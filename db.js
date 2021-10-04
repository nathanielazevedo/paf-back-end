const { Client } = require('pg');


const { getDatabaseUri } = require("./config");

let DB_URI = getDatabaseUri();



  const client = new Client({
    connectionString: DB_URI,
    ssl: {
      rejectUnauthorized: false,
    },
  });

client.connect();

module.exports = client;

