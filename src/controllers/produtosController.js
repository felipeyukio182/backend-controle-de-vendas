const db = require("../db")
const produtosRepository = require("../repositories/produtosRepository")

async function buscarProdutos(req, res) {
    const conn = await db.connect()
    const id = req.query.id || null
    const idUsuario = req.query.idUsuario

    try {
        const [produtos] = await produtosRepository.buscarProdutos(conn, id, idUsuario)
        
        res.send(produtos)
    
    } catch (error) {
        res.status(500).send(error)
    }

}

async function incluirProduto(req, res) {
    const conn = await db.connect()
    const idUsuario = req.query.idUsuario
    const produto = req.body
    
    try {
        await conn.beginTransaction()

        await produtosRepository.incluirProduto(conn, idUsuario, produto)

        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error)
    }

}

async function editarProduto(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario
    const produto = req.body

    try {
        await conn.beginTransaction()

        await produtosRepository.editarProduto(conn, id, idUsuario, produto)

        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error)
    }

}

async function excluirProduto(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario

    try {
        await conn.beginTransaction()

        await produtosRepository.excluirProduto(conn, id, idUsuario)

        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error) 
    }

}

module.exports = {
    buscarProdutos,
    incluirProduto,
    editarProduto,
    excluirProduto,
}