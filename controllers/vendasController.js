const db = require("../db")

async function buscarVendas(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario

    const dataInicial = req.query.dataInicial
    const dataFinal = req.query.dataFinal

    try {
        
        const vendas = await conn.query(`
        SELECT 
            a.id 'id',
            a.data_venda 'data',
            c.nome 'cliente',
            c.cnpj_cpf 'cnpjCpf',
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
        `, [idVenda, idUsuario])

        res.json(venda[0])

    } catch(error) {
        res.status(500).json(error)
    }
}

async function incluirVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    
    const idCliente = req.body.idCliente
    const produtos = req.body.produtos

    try {
        await conn.beginTransaction()

        await conn.query(`
            INSERT INTO tbvendas(id_pessoa, data_venda, id_usuario)
            VALUES(?, sysdate(), ?);
        `, [idCliente, idUsuario])


        for(let p of produtos) {
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
            `, [p.id, p.quantidade, p.preco])
        }

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

        await conn.query(`
            UPDATE tbvendas
            SET id_pessoa = ?
            WHERE id = ?
            AND id_usuario = ?;
        `, [idCliente, idVenda, idUsuario])

        await conn.query(`
            DELETE from tb_produto_venda
            WHERE id_venda = ?;
        `, [idVenda])

        for(let p of produtos) {
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
            `, [p.id, idVenda, p.quantidade, p.preco])
        }

        await conn.commit()

        res.json("ok")

    } catch(error) {
        await conn.rollback()
        console.log(error)
        res.status(500).json(error)
    }
}

async function deletarVenda(req, res) {
    const conn = await db.connect()

    const idUsuario = req.query.idUsuario
    const idVenda = req.query.idVenda

    try {
        await conn.beginTransaction()

        // Preciso deletar da tb_produto_venda primeiro, por causa da chave estrangeira
        await conn.query(`
            DELETE FROM tb_produto_venda
            WHERE id_venda = ?;
        `, [idVenda])

        // Depois eu deleto na tbvendas
        await conn.query(`
            DELETE FROM tbvendas
            WHERE id = ?
            AND id_usuario = ?;
        `, [idVenda, idUsuario])

        await conn.commit()

        res.json("ok")
        
    } catch(error) {
        await conn.rollback()
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