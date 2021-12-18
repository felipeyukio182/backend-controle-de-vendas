const db = require("../db")
const pessoasRepository = require("../repositories/pessoasRepository")

async function buscarPessoas(req, res) {
    const conn = await db.connect()
    const id = req.query.id || null
    const idUsuario = req.query.idUsuario

    try {
        const [rows] = await pessoasRepository.buscarPessoas(conn, id, idUsuario)
        res.send(rows)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function incluirPessoa(req, res) {
    const conn = await db.connect()
    const idUsuario = req.query.idUsuario
    const pessoa = req.body
    
    try {
        await conn.beginTransaction()

        await pessoasRepository.incluirPessoa(conn, idUsuario, pessoa)

        await conn.commit()
                
        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error)
    }
}

async function editarPessoa(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario
    const pessoa = req.body

    try {
        await conn.beginTransaction()

        await pessoasRepository.editarPessoa(conn, id, idUsuario, pessoa)
        
        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error)
    }

}

async function excluirPessoa(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario

    try {
        await conn.beginTransaction()

        await pessoasRepository.excluirPessoa(conn, id, idUsuario)

        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error) 
    }

}

module.exports = {
    buscarPessoas,
    incluirPessoa,
    editarPessoa,
    excluirPessoa,
}