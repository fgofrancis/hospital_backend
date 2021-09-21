
const { response} = require('express');
const  Usuario    = require('../models/usuario');
const  Hospital   = require('../models/hospital');
const  Medico     = require('../models/medico');

const getTodos = async(req, res = response) =>{

   const busqueda = req.params.busqueda;
   const regexp = new RegExp( busqueda, 'i');

//    const usuarios   = await Usuario.find({nombre:regexp});
//    const medicos    = await Medico.find({nombre:regexp});
//    const hospitales = await Hospital.find({nombre:regexp});

/* optimizando el codigo de mas arriba */
   const [usuarios, medicos, hospitales ] =   await Promise.all([
                Usuario.find({nombre:regexp}),
                Medico.find ({nombre:regexp}),
                Hospital.find({nombre:regexp})
   ]);

   res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}
const getDocumentosColeccion = async(req, res = response) =>{

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regexp = new RegExp( busqueda, 'i');

    let data = [];
    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre:regexp})
                                 .populate('usuario',  'nombre img')
                                 .populate('hospital', 'nombre img')
            break;

        case 'hospitales':
            data = await Hospital.find({nombre:regexp})
                                    .populate('usuario', 'nombre img');
            break;

        case 'usuarios':
             data = await Usuario.find({nombre:regexp});
            
            break;
    
        default:
           return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
            
    }
 
    res.status(200).json({
        ok: true,
        resultados:data
    });
 }

module.exports ={
    getTodos,
    getDocumentosColeccion
}