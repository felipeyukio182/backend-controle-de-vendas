const db = require("../db")
const vendasRepository = require("../repositories/vendasRepository")

async function buscarVendas(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    const dataInicial = req.query.dataInicial
    const dataFinal = req.query.dataFinal

    try {
        const vendas = await vendasRepository.buscarVendas(conn, idUsuario, dataInicial, dataFinal)

        for(let venda of vendas[0]) {
            venda.dataFormatada = (new Date(venda.data)).toLocaleString()
        }
        res.json(vendas[0])

    } catch(error) {
        res.status(500).json(error)
    }

}

async function buscarProdutosVenda(req, res) {
    const conn = await db.connect()

    const idVenda = req.query.idVenda
    const idUsuario = req.query.idUsuario

    try {
        const venda = await vendasRepository.buscarProdutosVenda(conn, idVenda, idUsuario)

        res.json(venda[0])

    } catch(error) {
        res.status(500).json(error)
    }
}

async function incluirVenda(req, res) {
    const conn = await db.connect()

    const idCliente = req.body.idCliente
    const idUsuario = req.query.idUsuario
    const produtos = req.body.produtos

    try {
        await conn.beginTransaction()

        await vendasRepository.incluirVenda(conn, idCliente, idUsuario, produtos)

        await conn.commit()

        res.json("ok")

    } catch(error) {
        await conn.rollback()
        res.status(500).send(error)
    }
}

async function editarVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    const idVenda = req.query.idVenda
    
    const idCliente = req.body.idCliente
    const produtos = req.body.produtos

    try {
        await conn.beginTransaction()

        await vendasRepository.editarVenda(conn, idCliente, idVenda, idUsuario, produtos)

        await conn.commit()

        res.json("ok")

    } catch(error) {
        await conn.rollback()
        console.log(error)
        res.status(500).json(error)
    }
}

async function excluirVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    const idVenda = req.query.idVenda

    try {
        await conn.beginTransaction()

        await vendasRepository.excluirVenda(conn, idVenda, idUsuario)
        await conn.commit()

        res.json("ok")
        
    } catch(error) {
        await conn.rollback()
        res.status(500).json(error)
    }
}

module.exports = {
    buscarVendas,
    buscarProdutosVenda,
    incluirVenda,
    editarVenda,
    excluirVenda
}