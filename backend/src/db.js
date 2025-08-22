const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: "postgres://admin:admin@db:5432/honeyshop",
  ssl: false,
});

module.exports = pool;
