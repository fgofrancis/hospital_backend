
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

    const Id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(Id);

        if (!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no Encontrado por id'
            });
        }

        //Esto es para un solo campo, se puede mejorar.
        // hospital.nombre = req.body.nombre;

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( Id, cambiosHospital, {new: true} );

        res.json({
           ok: true,
           hospital: hospitalActualizado
       })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
        
    }

}

const borrarHospital = async( req, res=response )=>{

    const Id = req.params.id;
 
    try {

        const hospital = await Hospital.findById(Id);

        if (!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no Encontrado por id'
            });
        }

       await Hospital.findByIdAndDelete( Id);

        res.json({
           ok: true,
           msg: 'Hospital Eliminado'
       })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
        
    }
   
}


module.exports = {
    getHospitales,
    creaHospital,
    actualizarHospital,
    borrarHospital,
}