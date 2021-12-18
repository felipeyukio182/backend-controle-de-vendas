
async function login(conn) {
    return await conn.query(`
        SELECT * FROM tbusuarios
    `)
}

module.exports = {
    login
}