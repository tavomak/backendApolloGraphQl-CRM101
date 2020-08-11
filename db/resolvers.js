//Importar el modelo Usuarios, este va a tener todo los metodos de mongoose para insertar los registros
const User = require('../models/User')
// Librería para hashear los password
const bcrypt = require('bcryptjs');

//Resolvers
const resolvers = {
    Query: {
        //x: Objeto que contiene los resultados retornados por el resolver padre. Permite que existan consultas anidadas en graphQl. Nunca se utiliza.
        //input: Parametro que viene del TypeQuery en el schema dentro de la funcion obtenercursos.
        //Contex: es un objeto que se comparte o esta disponible entre todos los resolvers se utiliza para autenticaciones y datos que sean necesarios en todos lados.
        //Info: tiene informacion sobre la consulta actual. No se utiliza mucho.
        obtenerCurso: (x, {input}, context, info ) => "Algo",
    },
    Mutation: {
        newUser: async (_, {input}) => {

            //Destructuring de email y pasword
            const { email, password } = input;

            //Revisra si el usuario está registrado
            const UserExist = await User.findOne({email});
            if(UserExist){
                throw new Error('El usuario ya está registrado')
            }

            //Hashear Password
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try {
                //Guardar en la base de datos
                const user = new User(input);
                //metodo para guardar
                user.save();
                // Queremos retornar el usuario creado desde los basos de la BBDD, en la mutación del SCHEMA en vez de retornar un string vamos a retornal el usuario con la forma sin el pasword
                return user
            } catch (error) {
                console.log(error);
            }
        }
    }
}
module.exports = resolvers;