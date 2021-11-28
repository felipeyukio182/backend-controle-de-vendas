const db = require("../db")

async function buscarPessoas(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const id_usuario = req.query.id_usuario

    try {
        // Pesquisando UM registro
        if(req.query.id) {
            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'name', cnpj_cpf 'cnpjCpf', insc_est 'inscEst', 
                    logradouro 'street', numero 'number', bairro 'district', cidade 'city', estado 'state'
                FROM 
                    tbpessoas
                WHERE id = ?
                AND id_usuario = ?
            `, [id, id_usuario])

            res.send(rows[0])

        // Pesquisando TODOS os registros
        } else {

            const [rows] = await conn.query(`
                SELECT 
                    id 'id', nome 'name', cnpj_cpf 'cnpjCpf', insc_est 'inscEst', 
                    logradouro 'street', numero 'number', bairro 'district', cidade 'city', estado 'state'
                FROM 
                    tbpessoas
                WHERE id_usuario = ?
            `, id_usuario)

            res.send(rows)
        }
    

    } catch (error) {
        res.status(500).send(error)
    }
}

async function incluirPessoa(req, res) {
    const conn = await db.connect()
    const pessoa = req.body
    
    try {
        await conn.query(`
            INSERT INTO tbpessoas
                (nome, cnpj_cpf, id_usuario, insc_est, logradouro, numero, bairro, cidade, estado)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [pessoa.name, pessoa.cnpjCpf, pessoa.id_usuario, pessoa.inscEst, 
                pessoa.street, pessoa.number, pessoa.district, pessoa.city, pessoa.state])

        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }
}

async function editarPessoa(req, res) {
    const conn = await db.connect()
    const pessoa = req.body
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
        `, [pessoa.name, pessoa.cnpjCpf, pessoa.inscEst, pessoa.street, pessoa.number, pessoa.district, pessoa.city, pessoa.state,
            id, pessoa.id_usuario])
        
        res.json("ok")

    } catch (error) {
        res.status(500).send(error)
    }

}

async function excluirPessoa(req, res) {
    const conn = await db.connect()
    const id = req.query.id
    const id_usuario = req.query.id_usuario

    try {
        if(req.query.id) {
            conn.query(`
                DELETE FROM tbpessoas
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
    buscarPessoas,
    incluirPessoa,
    editarPessoa,
    excluirPessoa,
}