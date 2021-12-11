const db = require("../db")

async function buscarProdutos(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario

    try {

        if(req.query.id) {
            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'nome', preco 'preco'
                FROM 
                    tbprodutos
                WHERE id = ?
                AND id_usuario = ?
            `, [id, idUsuario])

            res.send(rows[0])

        } else {

            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'nome', preco 'preco'
                FROM 
                    tbprodutos
                WHERE id_usuario = ?
            `, [idUsuario])

            res.send(rows)
        }
    
    } catch (error) {
        res.status(500).send(error)
    }

}

async function incluirProduto(req, res) {
    const conn = await db.connect()
    const produto = req.body
    const idUsuario = req.query.idUsuario
    
    try {
        await conn.beginTransaction()

        await conn.query(`
            INSERT INTO tbprodutos
                (nome, preco, id_usuario)
            VALUES
                (?, ?, ?)
            `, [produto.nome, produto.preco, idUsuario])

        await conn.commit()

        res.json("ok")

    } catch (error) {
        await conn.rollback()
        res.status(500).send(error)
    }

}

async function editarProduto(req, res) {
    const conn = await db.connect()
    const produto = req.body
    const id = req.query.id
    const idUsuario = req.query.idUsuario

    try {
        await conn.beginTransaction()

        await conn.query(`
            UPDATE tbprodutos
            SET nome = ?,
                preco = ?
            WHERE id = ?
            AND id_usuario = ?
        `, [produto.nome, produto.preco, id, idUsuario])
        

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

        if(req.query.id) {
            await conn.query(`
                DELETE FROM tbprodutos
                WHERE id = ?
                AND id_usuario = ?
            `, [id, idUsuario])
        }

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