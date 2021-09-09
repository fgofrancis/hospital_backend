const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

 const getUsuarios = async(req, res)=>{

    const desde = Number(req.query.desde) || 0 ;
    
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //                               .skip( desde )
    //                               .limit( 5 );

    // const total = await Usuario.countDocuments();

    /* Optimizando codigo de mas de arriba para realizar promesas en paralelas */
    const [usuarios, total ] = await Promise.all([
        Usuario
               .find({}, 'nombre email role google img')
               .skip( desde )
               .limit( 5 ),

        Usuario.countDocuments()
    ]);
   
                                
    res.json({
        ok: true,
        usuarios,
        total
       // uid : req.uid esto es para compartir informacion en las peticiones. viene del middleware
    })
}

const creaUsuario = async(req, res=response)=>{

   // console.log(req.body);
    const {email, password, nombre } = req.body;

 
    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'Email ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        //Gravando en la DB
       await usuario.save();
    
       // Generar token - JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.... revisar logs'
        });
    }
}

const actualizarUsuario = async( req, res=response)=>{

     //TODO: Validar token y validar si es el usuario correcto

    const uid = req.params.id;
    try {
      const usuarioDB = await Usuario.findById(uid);

      if (!usuarioDB){
          return res.status(404).json({
              ok: false,
              msg: 'No existe un usuario con ese id'
          });
      }


      //Actualizaciones
      const {password, google, email, ...campos} = req.body;

      if (usuarioDB.email !== email){
          const existeEmail = await Usuario.findOne({ email });
          if (existeEmail ){
              return res.status(400).json({
                  ok: false,
                  msg:'Ya existe un usuario con ese email'
              });
          }
      }

      if(!usuarioDB.google){
          campos.email = email;
      }else if( usuarioDB.email !== email ){
          return res.status(400).json({
              ok: false,
              msg: 'Usuarios de google no pueden cambiar su correo'
          });
      }

      const usuarioActulizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
         res.json({
            ok: true,
            usuario:usuarioActulizado
        })
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: 'false',
            msg: 'Error inesperado'
        })
        
    }

}

const borrarUsuario = async( req, res=response )=>{

    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        };

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado!!'
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
    getUsuarios,
    creaUsuario,
    actualizarUsuario,
    borrarUsuario,
}