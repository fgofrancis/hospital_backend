require('dotenv').config();

//import express from 'express'; es lo mismo que la instr de abajo
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');


//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors() );

//Lectura y parseo del body
app.use( express.json() );

//Base de datos
dbConnection();

//Directorio público
app.use(express.static('public') );


//Rutas
app.use('/api/usuarios', require('./routes/usuarios-routes') );
app.use('/api/hospitales', require('./routes/hospitales-routes') );
app.use('/api/medicos', require('./routes/medicos-routes') );
app.use('/api/todos', require('./routes/busqueda-routes') );
app.use('/api/uploads', require('./routes/upload-routes') );
app.use('/api/login', require('./routes/auth') );


//para levantar el servidor
app.listen( process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})

