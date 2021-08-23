/**
 * Hospitales
 * ruta: /api/todos/:busqueda
 */
 const { Router } = require('express');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { getTodos,getDocumentosColeccion } = require('../controllers/busqueda-controllers');
 
 const router = Router();
 
     router.get('/:busqueda', validarJWT, getTodos);
     router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);
 
    
 module.exports = router;
 