const db = require("../db")

async function buscarVendas(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario

    const dataInicial = req.query.dataInicial
    const dataFinal = req.query.dataFinal
    // const dataInicialMs = Number.parseInt(req.query.dataInicial)
    // const dataFinalMs = Number.parseInt(req.query.dataFinal)
    
    // const dataInicial = (new Date(dataInicialMs)).toLocaleString().replace(/(\d{2})\/(\d{2})\/(\d{4})\s(.*)/, "$3-$2-$1 $4")
    // const dataFinal = (new Date(dataFinalMs)).toLocaleString().replace(/(\d{2})\/(\d{2})\/(\d{4})\s(.*)/, "$3-$2-$1 $4")

    // console.log(dataInicialMs)
    // console.log(dataFinalMs)
    // console.log(dataInicial)
    // console.log(dataFinal)


    try {
        
        const vendas = await conn.query(`
        SELECT 
            a.id 'id',
            a.data_venda 'data',
            c.nome 'cliente',
            c.id 'idCliente',
            sum(d.valor * d.quantidade) 'total'
        FROM 
            tbvendas a,
            tbprodutos b,
            tbpessoas c,
            tb_produto_venda d
        WHERE
            a.id_usuario = ?
        AND a.id_usuario = c.id_usuario
        AND a.id_usuario = b.id_usuario
        AND a.id_pessoa = c.id
        AND a.id = d.id_venda
        AND b.id = d.id_produto
        AND a.data_venda BETWEEN ? AND ?
        GROUP BY a.id
        ORDER BY a.data_venda DESC
        ;
        `, [idUsuario, dataInicial, dataFinal])

        // console.log(vendas[0])
        res.json(vendas[0])

    } catch(error) {
        res.status(500).json(error)
    }

}

async function buscarProdutosVenda(req, res) {
    const conn = await db.connect()

    const id = req.query.idVenda
    const idUsuario = req.query.idUsuario

    try {
        const venda = await conn.query(`       
            SELECT 
                a.id 'idVenda',
                a.data_venda 'data',
                c.id 'idCliente',
                c.nome 'cliente',
                b.id 'idProduto',
                b.nome 'produto',
                d.quantidade 'quantidade',
                d.valor 'preco'
            FROM 
                tbvendas a,
                tbprodutos b,
                tbpessoas c,
                tb_produto_venda d
            WHERE
                a.id = ?
            AND a.id_usuario = ?
            AND a.id_usuario = c.id_usuario
            AND a.id_pessoa = c.id
            AND a.id = d.id_venda
            AND b.id = d.id_produto
            ;
        `, [id, idUsuario])


        res.json(venda[0])

    } catch(error) {
        res.status(500).json(error)
    }
}

async function incluirVenda(req, res) { ///////////////PRECISO VER AQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ PRA BAIXO
    const conn = await db.connect()

    const idUsuario = req.body.idUsuario
    const cliente = req.body.cliente
    const produtos = req.body.orderProducts

    try {
        await conn.query(`
            INSERT INTO tbvendas(id_pessoa, data_venda, id_usuario)
            VALUES(?, sysdate(), ?);
        `, [cliente.id, idUsuario])


        for(let p of orderProducts) {
            await conn.query(`
                INSERT INTO tb_produto_venda(
                    id_produto,
                    id_venda,
                    quantidade,
                    valor
                )
                VALUES(
                    ?,
                    (SELECT id
                    FROM tbvendas
                    ORDER BY id desc
                    LIMIT 1),
                    ?,
                    ?
                );
            `, [produtos.product.id, produtos.amount, produtos.product.price])
        }

        res.json("ok")

    } catch(error) {
        res.status(500).send(error)
    }
}

async function editarVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.body.idUsuario
    const client = req.body.client
    const orderProducts = req.body.orderProducts

    const id = req.query.id

    try {
        await conn.query(`
            UPDATE tbvendas
            SET id_pessoa = ?
            WHERE id = ?
            AND id_usuario = ?;
        `, [client.id, id, idUsuario])

        await conn.query(`
            DELETE from tb_produto_venda
            WHERE id_venda = ?;
        `, [id])

        for(let p of orderProducts) {
            await conn.query(`
                INSERT INTO tb_produto_venda(
                    id_produto,
                    id_venda,
                    quantidade,
                    valor)
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?
                );
            `, [p.product.id, id, p.amount, p.product.price])
        }

        res.json("ok")

    } catch(error) {
        res.status(500).json(error)
    }
}

async function deletarVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    const id = req.query.id

    try {
        // Preciso deletar da tb_produto_venda primeiro, por causa da chave estrangeira
        await conn.query(`
            DELETE FROM tb_produto_venda
            WHERE id_venda = ?;
        `, [id])

        // Depois eu deleto na tbvendas
        await conn.query(`
            DELETE FROM tbvendas
            WHERE id = ?
            AND id_usuario = ?;
        `, [id, idUsuario])

        
    } catch(error) {
        res.status(500).json(error)
    }
}

module.exports = {
    // buscarTodasVendas,
    buscarVendas,
    buscarProdutosVenda,
    incluirVenda,
    editarVenda,
    deletarVenda
}