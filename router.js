const { Router } = require('express')

const loginController = require("./controllers/loginController")
const clientsController = require("./controllers/clientsController")
const productsController = require("./controllers/productsController")
const salesController = require("./controllers/salesController")

const router = Router();

// Clientes
router.get('/clients', clientsController.buscarPessoas)
router.post('/clients', clientsController.incluirPessoa)
router.put('/clients', clientsController.editarPessoa)
router.delete('/clients', clientsController.excluirPessoa)

// Produtos
router.get('/products', productsController.buscarProdutos)
router.post('/products', productsController.incluirProduto)
router.put('/products', productsController.editarProduto)
router.delete('/products', productsController.excluirProduto)

// Vendas
router.get('/allSales', salesController.buscarTodasVendas)
router.get('/sales', salesController.buscarVenda)
router.post('/sales', salesController.incluirVenda)
router.put('/sales', salesController.editarVenda)
router.delete('/sales', salesController.deletarVenda)

// Login
router.post('/users', loginController.login)

module.exports = router;
