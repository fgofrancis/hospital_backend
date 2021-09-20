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
     getMedicoById,
 } = require('../controllers/Medicos-controllers');
 
 const router = Router();
 
     router.get('/',validarJWT ,getMedicos);
 
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
        validarJWT,
        check('nombre', 'El nombre del médico es obligatorio').notEmpty(),
        validarCampos
     ],
     actualizarMedico);
 
     router.delete('/:id',validarJWT ,borrarMedico);

     router.get('/:id',validarJWT , getMedicoById);
 
 module.exports = router;
 