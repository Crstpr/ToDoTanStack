const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Crstpr421!",
    database: "tanstack",
    host: "localhost",
    port: 5432
});

module.exports = pool;