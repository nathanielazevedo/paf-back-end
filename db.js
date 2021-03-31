const { Client } = require('pg');


const { getDatabaseUri } = require("./config");

let DB_URI = getDatabaseUri();

// let ssl;
// if (DB_URI !== "postgresql:///paf") {
//   ssl = {
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   }
// } else {
//   ssl = null;
// }
//  console.log(ssl)
  const client = new Client({
    connectionString: DB_URI,
    ssl: {
      rejectUnauthorized: false,
    },
  });

client.connect();

module.exports = client;