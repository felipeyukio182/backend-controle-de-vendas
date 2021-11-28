// Comunicação com MYSQL

async function connect() {
    if(global.connection && global.connection.state !== "disconnected") {
        return global.connection
    }

    const mysql = require("mysql2/promise")
    const connection = await mysql.createConnection("mysql://root:12345678@localhost:3306/controle_de_vendas")
    console.log("Conectou com MYSQL!")
    global.connection = connection

    return connection
}

module.exports = {connect}