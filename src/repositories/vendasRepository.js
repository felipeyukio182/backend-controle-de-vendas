

async function buscarVendas(conn, idUsuario, dataInicial, dataFinal) {
    return await conn.query(`
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
}

async function buscarProdutosVenda(conn, idVenda, idUsuario) {
    return await conn.query(`       
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
}

async function incluirVenda(conn, idCliente, idUsuario, produtos) {
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
}

async function editarVenda(conn, idCliente, idVenda, idUsuario, produtos) {
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

}

async function excluirVenda(conn, idVenda, idUsuario) {
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
}


module.exports = {
    buscarVendas,
    buscarProdutosVenda,
    incluirVenda,
    editarVenda,
    excluirVenda,
}