//Importar el modelos, estos va a tener todo los metodos de mongoose para insertar los registros
const User = require('../models/User'),
Products = require('../models/Products');

// Librería para hashear los password
const bcrypt = require('bcryptjs');
//Librería para Web Tokens
const jwt = require('jsonwebtoken');
//Firma del token, creada en las varialbes de entornos
require('dotenv').config({path: 'variables.env'});

//Creat Token

const createToken = (user, secret, expiresIn) => {
    //console.log(`Crear Token :`, user);

    const { id, email, name, lastName } = user;

    return jwt.sign( { id, email, name, lastName }, secret, { expiresIn } )
}
//Resolvers
const resolvers = {
    Query: {
        getUser: async (_, {token}) => {
            const userId = await jwt.verify(token, process.env.SECRETA);
            return userId;
        },
        getProducts: async () => {
            try {
                const products = await Products.find({})

                return products;
            } catch (error) {
                console.log(error)
            }
        },
        getProduct: async (_, {id}) => {
            // Revisar si el producto existe
            const product = await Products.findById(id);

            if(!product) {
                throw new Error('Producto No Encontrado');
            }

            return product;
        },
    },
    Mutation: {
        newUser: async (_, {input}) => {

            //Destructuring de email y pasword
            const { email, password } = input;
            //console.log(`input del newUser:`, input);

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
        },
        authUser: async (_, {input}) => {

            const { email, password } = input;

            //Si el usuario existe
            const existeUsuario = await User.findOne({email});
            if(!existeUsuario){
                throw new Error('El usuario no está registrado')
            }

            // Si el password es correcto
            const passwordCorrecto = await bcrypt.compare( password, existeUsuario.password );

            if(!passwordCorrecto){
                throw new Error(`Password Incorrecto`);
            }

            //Crear token
            return {
                token: createToken(existeUsuario, process.env.SECRETA, '24h' )
            }
        },
        newProduct: async (_, {input}) => {

            try {
                const newProduct = new Products(input);

                //Almacenar en la BBDD
                const saveProduct = await newProduct.save();

                return saveProduct;
                
            } catch (error) {
                console.log(error)
            }

        },
        updateProduct: async (_, {id, input}) => {
            /// Revisar si el producto existe
            let product = await Products.findById(id);

            if(!product) {
                throw new Error('Producto No Encontrado');
            }

            //Guardarlo en BBDD
            product = await Products.findByIdAndUpdate({_id : id}, input, {new: true});

            return product;
        },
        removeProduct: async(_, {id}) => {
            /// Revisar si el producto existe
            let product = await Products.findById(id);

            if(!product) {
                throw new Error('Producto No Encontrado');
            }

            //Guardarlo en BBDD
            product = await Products.findByIdAndDelete({_id : id});

            return "Producto Eliminado";
        }
    }
}

/* const checkProduct = async (id) => {
    // Revisar si el producto existe
    const product = await Products.findById(id);

    if(!product) {
        throw new Error('Producto No Encontrado');
    }
} */

module.exports = resolvers;