const mysql = require('mysql2')

//Coneção ao banco de dados
const pool = mysql.createPool({
    connectionLimit:10,
    host: "localhost",
    user: "root",
    password: "1937",
    database: "nodemysql2",
})

module.exports = pool