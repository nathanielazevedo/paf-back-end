
const SECRET_KEY = "azevedo_hidden";

require("dotenv").config();
const PORT = +process.env.PORT || 3001;

  function getDatabaseUri() {
    return process.env.NODE_ENV === "test"
      ? "postgresql:///paf_test"
      : process.env.DATABASE_URL || "postgresql:///paf";
  }
  
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
    SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
    PORT
}
