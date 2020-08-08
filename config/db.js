const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDb = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            //Evitan mensajes inecesarios en la consola
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log('BD Conectada')
    } catch (error) {
        console.log('Hubo un error:', error);
        process.exit(1); //Detiene la aplicacion
    }
}

module.exports = conectarDb;