const db = require("../db")

async function buscarPessoas(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const idUsuario = req.query.idUsuario

    try {
        // Pesquisando UM registro
        if(req.query.id) {
            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'nome', cnpj_cpf 'cnpjCpf', insc_est 'ie', 
                    logradouro 'logradouro', numero 'numero', bairro 'bairro', cidade 'cidade', estado 'estado'
                FROM 
                    tbpessoas
                WHERE id = ?
                AND id_usuario = ?
            `, [id, idUsuario])

            res.send(rows[0])

        // Pesquisando TODOS os registros
        } else {

            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'nome', cnpj_cpf 'cnpjCpf', insc_est 'ie', 
                    logradouro 'logradouro', numero 'numero', bairro 'bairro', cidade 'cidade', estado 'estado'
                FROM 
                    tbpessoas
                WHERE id_usuario = ?
            `, [idUsuario])

            res.send(rows)
        }
    

    } catch (error) {
        res.status(500).send(error)
    }
}

async function incluirPessoa(req, res) {
    const conn = await db.connect()
    const idUsuario = req.query.idUsuario
    const pessoa = req.body
    
    try {
        await conn.query(`
            INSERT INTO tbpessoas
                (nome, cnpj_cpf, id_usuario, insc_est, logradouro, numero, bairro, cidade, estado)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [pessoa.nome, pessoa.cnpjCpf, idUsuario, pessoa.ie, 
                pessoa.logradouro, pessoa.numero, pessoa.bairro, pessoa.cidade, pessoa.estado])

        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }
}

async function editarPessoa(req, res) {
    const conn = await db.connect()
    const pessoa = req.body
    const idUsuario = req.query.idUsuario
    const id = req.query.id

    try {
        await conn.query(`
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
        
        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }

}

async function excluirPessoa(req, res) {
    const conn = await db.connect()
    const idUsuario = req.query.idUsuario
    const id = req.query.id

    try {
        if(req.query.id) {
            conn.query(`
                DELETE FROM tbpessoas
                WHERE id = ?
                AND id_usuario = ?
            `, [id, idUsuario])
        }

        res.json("ok")

    } catch (error) {
       res.status(500).send(error) 
    }

}

module.exports = {
    buscarPessoas,
    incluirPessoa,
    editarPessoa,
    excluirPessoa,
}