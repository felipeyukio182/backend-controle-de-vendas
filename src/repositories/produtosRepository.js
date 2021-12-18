
async function buscarProdutos(conn, id, idUsuario) {
    if(id) {
        return await conn.query(`
            SELECT 
                id 'id', nome 'nome', preco 'preco'
            FROM 
                tbprodutos
            WHERE id = ?
            AND id_usuario = ?
        `, [id, idUsuario])

    } else {
        return await conn.query(`
            SELECT 
                id 'id', nome 'nome', preco 'preco'
            FROM 
                tbprodutos
            WHERE id_usuario = ?
        `, [idUsuario])
    }
}
async function incluirProduto(conn, idUsuario, produto) {
    return await conn.query(`
        INSERT INTO tbprodutos
            (nome, preco, id_usuario)
        VALUES
            (?, ?, ?)
    `, [produto.nome, produto.preco, idUsuario])
}
async function editarProduto(conn, id, idUsuario, produto) {
    return await conn.query(`
        UPDATE tbprodutos
        SET nome = ?,
            preco = ?
        WHERE id = ?
        AND id_usuario = ?
    `, [produto.nome, produto.preco, id, idUsuario])
}
async function excluirProduto(conn, id, idUsuario) {
    return await conn.query(`
        DELETE FROM tbprodutos
        WHERE id = ?
        AND id_usuario = ?
    `, [id, idUsuario])
}

module.exports = {
    buscarProdutos,
    incluirProduto,
    editarProduto,
    excluirProduto,
}
