

async function buscarPessoas(conn, id, idUsuario) {
    // Pesquisando um registro
    if(id) {
        return await conn.query(`
            SELECT 
                id 'id', nome 'nome', cnpj_cpf 'cnpjCpf', insc_est 'ie', 
                logradouro 'logradouro', numero 'numero', bairro 'bairro', cidade 'cidade', estado 'estado'
            FROM 
                tbpessoas
            WHERE id = ?
            AND id_usuario = ?
        `, [id, idUsuario])

    // Pesquisando TODOS os registros
    } else {

        return await conn.query(`
            SELECT 
                id 'id', nome 'nome', cnpj_cpf 'cnpjCpf', insc_est 'ie', 
                logradouro 'logradouro', numero 'numero', bairro 'bairro', cidade 'cidade', estado 'estado'
            FROM 
                tbpessoas
            WHERE id_usuario = ?
        `, [idUsuario])
    }
}

async function incluirPessoa(conn, idUsuario, pessoa) {
    return await conn.query(`
        INSERT INTO tbpessoas
            (nome, cnpj_cpf, id_usuario, insc_est, logradouro, numero, bairro, cidade, estado)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [pessoa.nome, pessoa.cnpjCpf, idUsuario, pessoa.ie, pessoa.logradouro, pessoa.numero, pessoa.bairro, pessoa.cidade, pessoa.estado])
}

async function editarPessoa(conn, id, idUsuario, pessoa) {
    return await conn.query(`
        UPDATE tbpessoas
        SET nome = ?,
            cnpj_cpf = ?,
            insc_est = ?, 
            logradouro = ?, 
            numero = ?, 
            bairro = ?, 
            cidade = ?, 
            estado = ?
        WHERE id = ?
        AND id_usuario = ?
    `, [pessoa.nome, pessoa.cnpjCpf, pessoa.ie, pessoa.logradouro, pessoa.numero, pessoa.bairro, pessoa.cidade, pessoa.estado,
        id, idUsuario])
}

async function excluirPessoa(conn, id, idUsuario) {
    return await conn.query(`
        DELETE FROM tbpessoas
        WHERE id = ?
        AND id_usuario = ?
    `, [id, idUsuario])
}

module.exports = {
    buscarPessoas,
    incluirPessoa,
    editarPessoa,
    excluirPessoa,
}