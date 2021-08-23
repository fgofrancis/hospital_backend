/**
 * Medicos
 * ruta: /api/medicos
 */
 const { Router } = require('express');
 const { check} = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 const { validarJWT } = require('../middlewares/validar-jwt');
 
 const {
     getMedicos,
     creaMedico,
     actualizarMedico,
     borrarMedico,
 } = require('../controllers/Medicos-controllers');
 
 const router = Router();
 
     router.get('/' ,getMedicos);
 
     router.post('/',
         [
             validarJWT,
             check('nombre', 'El nombre del medico requerido').notEmpty(),
             check('hospital', 'El hospital id debe ser válido').isMongoId(),
             validarCampos
         ],
     creaMedico
     );
 
     router.put('/:id',
     [
     ],
     actualizarMedico);
 
     router.delete('/:id', borrarMedico);
 
 module.exports = router;
 