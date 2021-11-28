const db = require("../db")

async function buscarProdutos(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const id_usuario = req.query.id_usuario

    try {
        if(req.query.id) {
            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'name', preco 'price'
                FROM 
                    tbprodutos
                WHERE id = ?
                AND id_usuario = ?
            `, [id, id_usuario])

            res.send(rows[0])

        } else {

            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'name', preco 'price'
                FROM 
                    tbprodutos
            `)
            res.send(rows)
        }
    
    } catch (error) {
        res.status(500).send(error)
    }

}

async function incluirProduto(req, res) {
    const conn = await db.connect()
    const produto = req.body
    
    try {
        await conn.query(`
            INSERT INTO tbprodutos
                (nome, preco, id_usuario)
            VALUES
                (?, ?, ?)
            `, [produto.name, produto.price, produto.id_usuario])

        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }

}

async function editarProduto(req, res) {
    const conn = await db.connect()
    const produto = req.body
    const id = req.query.id

    try {
        await conn.query(`
            UPDATE tbprodutos
            SET nome = ?,
                preco = ?
            WHERE id = ?
            AND id_usuario = ?
        `, [produto.name, produto.price, id, produto.id_usuario])
        
        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }

}

async function excluirProduto(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const id_usuario = req.query.id_usuario

    try {
        if(req.query.id) {
            conn.query(`
                DELETE FROM tbprodutos
                WHERE id = ?
                AND id_usuario = ?
            `, [id, id_usuario])
        }

        res.json("ok")

    } catch (error) {
       res.status(500).send(error) 
    }

}

module.exports = {
    buscarProdutos,
    incluirProduto,
    editarProduto,
    excluirProduto,
}