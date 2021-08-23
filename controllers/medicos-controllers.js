
const {response} = require('express');
const Medico = require('../models/medico');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


 const getMedicos = async(req, res=response)=>{

    const medicos = await Medico.find()
                            .populate('usuario', 'nombre img')
                            .populate('hospital','nombre img')

    res.json({
        ok: true,
        msg: 'getMedicos',
        medicos,
       // uid : req.uid esto es para compartir informacion en las peticiones. viene del middleware
    })
}

const creaMedico = async(req, res=response)=>{

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el médico, llamar al administrador'
        });
        
    }
}

const actualizarMedico = async( req, res=response)=>{

     //TODO: Validar token y validar si es el usuario correcto
     res.json({
        ok: true,
        msg: 'actualizarMedico'
        
    })
    // const uid = req.params.id;
    // try {
    //   const hospitalDB = await Hospital.findById(uid);

    //   if (!hospitalDB){
    //       return res.status(404).json({
    //           ok: false,
    //           msg: 'No existe un usuario con ese id'
    //       });
    //   }


    //   //Actualizaciones
    //   const {password, google, email, ...campos} = req.body;

    //   if (hospitalDB.email !== email){
    //       const existeEmail = await Hospital.findOne({ email });
    //       if (existeEmail ){
    //           return res.status(400).json({
    //               ok: false,
    //               msg:'Ya existe un usuario con ese email'
    //           });
    //       }
    //   }
    //   campos.email = email;
    //   const hospitalActulizado = await Hospital.findByIdAndUpdate(uid, campos, {new: true});
    //      res.json({
    //         ok: true,
    //         usuario:hospitalActulizado
    //     })
    // } catch (error) {
    //     console.log(error),
    //     res.status(500).json({
    //         ok: 'false',
    //         msg: 'Error inesperado'
    //     })
        
    // }

}

const borrarMedico = async( req, res=response )=>{

    res.json({
        ok: true,
        msg: 'borrarMedico'
        
    });

    const uid = req.params.id;
    // try {

    //     const hospitalDB = await Hospital.findById(uid);

    //     if (!hospitalDB){
    //         return res.status(404).json({
    //             ok: false,
    //             msg: 'No existe un hospital con ese id'
    //         });
    //     };

    //     await Hospital.findByIdAndDelete(uid);

    //     res.json({
    //         ok: true,
    //         msg: 'Hospital eliminado!!'
    //     })
        
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Hable con el Administrador'
    //     })
    // }
}


module.exports = {
    getMedicos,
    creaMedico,
    actualizarMedico,
    borrarMedico,
}