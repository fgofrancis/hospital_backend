const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async( req, res=response )=>{
  
   const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email});

        if ( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'email y/o contraseña no válida1'
            })
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'email y/o contraseña no válida2'
            })
        } 

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
    }

}
const googleSignIn = async(req, res=response)=>{

    const googleToken = req.body.token;

    try {
        
        const {name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario = '';

        if(!usuarioDB){
             //No existe usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: false
            });
        }else{
            //existe usuario
            usuario = usuarioDB,
            usuario.google = true;
        }

        //Guardar en BD
        usuario.save();
        
        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
}
const renewToken = async( req, res=response ) =>{

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    //Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}