
const {response} = require('express');
const Hospital = require('../models/hospital');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

 const getHospitales = async(req, res=response)=>{

    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre email img')

    res.json({
        ok: true,
        msg: 'getHospitales',
        hospitales
       // uid : req.uid esto es para compartir informacion en las peticiones. viene del middleware
    })
}

const creaHospital = async(req, res=response)=>{

    const uid = req.uid;
    //console.log(uid);
    //const hospital = new Hospital(req.body);
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
            
            const hospitalDB = await hospital.save();

            res.json({
                ok: true,
                hospital: hospitalDB,
            })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....hable con al Administrador'
        });
    }
}

const actualizarHospital = async( req, res=response)=>{

     //TODO: Validar token y validar si es el usuario correcto
     res.json({
        ok: true,
        msg: 'ActualizarHospitales'
        
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

const borrarHospital = async( req, res=response )=>{

    res.json({
        ok: true,
        msg: 'BorrarHospitales'
        
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
    getHospitales,
    creaHospital,
    actualizarHospital,
    borrarHospital,
}