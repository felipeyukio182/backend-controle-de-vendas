const db = require("../db")
const loginRepository = require("../repositories/loginRepository")

async function login(req, res) {
    const conn = await db.connect()
    let loginUsuario = req.body

    try {
        const [listaUsuarios] = await loginRepository.login(conn)

        for(let usuario of listaUsuarios) {
            if(loginUsuario.usuario == usuario.usuario && loginUsuario.senha == usuario.senha) {
                res.send({
                    "usuario": usuario,
                    "status": "ok"
                })
                return
            }
        }

        res.send({
            "usuario": null,
            "status": "erro"
        })
    
    } catch (error) {
        res.status(500).send(error)
    }
    
}

module.exports = {
    login,
}