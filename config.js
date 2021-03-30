
const SECRET_KEY = "azevedo_hidden";

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///paf_test"
    : process.env.DATABASE_URL || "postgresql:///paf";
  
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
    DB_URI,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR
}
