
const SECRET_KEY = "azevedo_hidden";

require("dotenv").config();

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "paf_test"
    : process.env.DATABASE_URL || "paf";
}
  
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
    DB_URI,
    SECRET_KEY,
  BCRYPT_WORK_FACTOR,
    getDatabaseUri
}
