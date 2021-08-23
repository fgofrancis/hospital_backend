/**
 * Hospitales
 * ruta: /api/hospitales
 */
const { Router } = require('express');
const { check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitales,
    creaHospital,
    actualizarHospital,
    borrarHospital,
} = require('../controllers/hospitales-controllers');

const router = Router();

    router.get('/' ,getHospitales);

    router.post('/',
        [
          validarJWT,
          check('nombre', 'El nombre del hospital es obligatorio').notEmpty(),
          validarCampos
        ],
    creaHospital
    );

    router.put('/:id',
    [
    ],
    actualizarHospital);

    router.delete('/:id', borrarHospital);

module.exports = router;
