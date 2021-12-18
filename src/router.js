const { Router } = require('express')

const loginController = require("./controllers/loginController")
const pessoasController = require("./controllers/pessoasController")
const produtosController = require("./controllers/produtosController")
const vendasController = require("./controllers/vendasController")

const router = Router();

// Clientes
router.get('/pessoas', pessoasController.buscarPessoas)
router.post('/pessoas', pessoasController.incluirPessoa)
router.put('/pessoas', pessoasController.editarPessoa)
router.delete('/pessoas', pessoasController.excluirPessoa)

// Produtos
router.get('/produtos', produtosController.buscarProdutos)
router.post('/produtos', produtosController.incluirProduto)
router.put('/produtos', produtosController.editarProduto)
router.delete('/produtos', produtosController.excluirProduto)

// Vendas
router.get('/vendas', vendasController.buscarVendas)
router.get('/produtosVenda', vendasController.buscarProdutosVenda)
router.post('/vendas', vendasController.incluirVenda)
router.put('/vendas', vendasController.editarVenda)
router.delete('/vendas', vendasController.excluirVenda)

// Login
router.post('/usuarios', loginController.login)

module.exports = {router};
