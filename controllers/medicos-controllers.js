
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
const getMedicoById = async(req, res=response)=>{

    const id = req.params.id;

    try {
        
        const medico = await Medico.findById(id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital','nombre img')
    
        res.json({
            ok: true,
            medico
           // uid : req.uid esto es para compartir informacion en las peticiones. viene del middleware
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg:'Hable con el administrador'
        })
    }
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

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);
    
        if (!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Médico no existe por id'
            });
        }
    
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
    
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });
    
    
         res.json({
            ok: true,
            medico: medicoActualizado
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
        
    }

}

const borrarMedico = async( req, res=response )=>{

    const Id = req.params.id;
 
    try {

        const medico = await Medico.findById(Id);

        if (!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Médico no Encontrado por id'
            });
        }

       await Medico.findByIdAndDelete( Id);

        res.json({
           ok: true,
           msg: 'Médico Eliminado'
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
    getMedicos,
    creaMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}