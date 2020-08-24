//Importar el modelos, estos va a tener todo los metodos de mongoose para insertar los registros
const User = require('../models/User'),
    Products = require('../models/Products'),
    Client = require('../models/Client'),
    Orders = require('../models/Orders');

// Librería para hashear los password
const bcrypt = require('bcryptjs');
//Librería para Web Tokens
const jwt = require('jsonwebtoken');
//Firma del token, creada en las varialbes de entornos
require('dotenv').config({
    path: 'variables.env'
});

//Creat Token

const createToken = (user, secret, expiresIn) => {
    //console.log(`Crear Token :`, user);
    const {
        id,
        email,
        name,
        lastName
    } = user;

    return jwt.sign({
        id,
        email,
        name,
        lastName
    }, secret, {
        expiresIn
    })
}
//Resolvers
const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
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
        getProduct: async (_, { id }) => {
            const product = await Products.findById(id);
            // Revisar si el producto existe
            if(!product) {
                throw new Error('Producto no encontrado');
            }
            // Retornarlo
            return product;
        },
        getClient: async (_, { id }, ctx) => {
            //Revisar si el cliente existe
            const client = await Client.findById(id);

            if (!client) {
                throw new Error('Cliente no encontrado');
            }

            //Quien lo creo puede verlo
            if (client.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            }

            return client;
        },
        getClients: async () => {
            try {
                const clients = await Client.find({});
                return clients;
            } catch (error) {
                console.log('GetClient:', error)
            }
        },
        getClientsVendor: async (_, {}, ctx) => {
            try {
                const clients = await Client.find({
                    vendor: ctx.user.id.toString()
                });
                return clients;
            } catch (error) {
                console.log('GetClient:', error)
            }
        },
        getOrders: async () => {
            try {
                const orders = await Orders.find({});
                return orders;
            } catch (error) {
                console.log('GetClient:', error)
            }
        },
        getOrdersVendor: async (_, {}, ctx) => {
            try {
                const orders = await Orders.find({ vendor: ctx.user.id });
                return orders;
            } catch (error) {
                console.log('GetClient:', error)
            }
        },
        getOrderById: async (_, {id}, ctx) => {
            //Verificar si el pedido existe
            const order = await Orders.findById(id);
            if (!order) {
                throw new Error('Pedido no existe')
            }

            //Quien lo creo puede verlo
            if(order.vendor.toString() != ctx.user.id){
                throw new Error('No tienes permiso para ver esta orden')
            }

            return order;
        },
        getOrdersByState: async (_, { state }, ctx) => {
            console.log(state)
            const orders = await Orders.find({ vendor: ctx.user.id, state: state});
            return orders;
        },
        bestClients: async () => {
            const clients = await Orders.aggregate([
                { $match : { state : "COMPLETADO" } },
                { $group : {
                    _id : "$client", //Modelo en codigo
                    total: { $sum: '$price' } // Campo en la BBDD
                }}, 
                {
                    $lookup: {
                        from: 'clients', //Nombre de la bbdd en mongo
                        localField: '_id',
                        foreignField: "_id",
                        as: "client"
                    }
                },
                {
                    $limit: 10
                }, 
                {
                    $sort : { total : -1 }
                }
            ]);

            return clients;
        },
        bestVendors: async () => {
            const vendors = await Orders.aggregate([
                { $match : { state : "COMPLETADO"} },
                { $group : {
                    _id : "$vendor", 
                    total: {$sum: '$price'}
                }},
                {
                    $lookup: {
                        from: 'users', 
                        localField: '_id',
                        foreignField: '_id',
                        as: 'vendor'
                    }
                }, 
                {
                    $limit: 3
                }, 
                {
                    $sort: { total : -1 }
                }
            ]);

            return vendors;
        },
        searchProduct: async(_, { text }) => {
            console.log(text);
            const product = await Products.find({ $text: { $search: text  } }).limit(10)

            return product;
        }
    },
    Mutation: {
        newUser: async (_, { input }) => {

            //Destructuring de email y pasword
            const {
                email,
                password
            } = input;
            //console.log(`input del newUser:`, input);

            //Revisra si el usuario está registrado
            const UserExist = await User.findOne({
                email
            });
            if (UserExist) {
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
        authUser: async (_, { input }) => {
            const {
                email,
                password
            } = input;

            //Si el usuario existe
            const existeUsuario = await User.findOne({
                email
            });
            if (!existeUsuario) {
                throw new Error('El usuario no está registrado')
            }

            // Si el password es correcto
            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);

            if (!passwordCorrecto) {
                throw new Error(`Password Incorrecto`);
            }

            //Crear token
            return {
                token: createToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },
        newProduct: async (_, { input }) => {

            try {
                const newProduct = new Products(input);

                //Almacenar en la BBDD
                const saveProduct = await newProduct.save();

                return saveProduct;

            } catch (error) {
                console.log(error)
            }

        },
        updateProduct: async (_, { id, input }) => {
            // Revisar si el producto existe
            const product = await Products.findById(id);

            if (!product) {
                throw new Error('Producto No Encontrado');
            }

            //Guardarlo en BBDD
            product = await Products.findByIdAndUpdate({
                _id: id
            }, input, {
                new: true
            });

            return product;
        },
        removeProduct: async (_, { id }) => {
            // Revisar si el producto existe
            const product = await Products.findById(id);

            if (!product) {
                throw new Error('Producto No Encontrado');
            }

            //Guardarlo en BBDD
            product = await Products.findByIdAndDelete({
                _id: id
            });

            return "Producto Eliminado";
        },
        newClient: async (_, { input }, ctx) => {

            console.log('Context:', ctx);
            const {
                email
            } = input;

            //Verificar si existe en el registro
            console.log('Input', input);
            const client = await Client.findOne({
                email
            });
            if (client) {
                throw new Error('Ese cliente ya esta registrado');
            }

            const newClient = new Client(input);

            // //Asignar Vendedor
            newClient.vendor = ctx.user.id

            //Guardar en BBDD
            try {
                const result = await newClient.save();
                return result;
            } catch (error) {
                console.log("Error:", error);
            }
        },
        updateClient: async (_, { id, input }, ctx) => {
            //Veridicar si existe
            let client = await Client.findById(id);

            if (!client) {
                throw new Error('Cliente no existe')
            }

            //Verificar fue creado por el vendedor
            if (client.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            }

            //Actualizar cliente en la BBDD
            client = await Client.findOneAndUpdate({
                _id: id
            }, input, {
                new: true
            });
            return client;
        },
        removeClient: async (_, { id }, ctx) => {
            //Veridicar si existe
            let client = await Client.findById(id);

            if (!client) {
                throw new Error('Cliente no existe')
            }

            //Verificar fue creado por el vendedor
            if (client.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            }

            //Eliminar
            client = await Client.findOneAndDelete({
                _id: id
            });
            return "Cliente Eliminado";
        },
        newOrder: async (_, { input }, ctx) => {
            const { client } = input;
            //console.log(input);
            let clientExist = await Client.findById(client);
            //Verificar si existe cliente
            if (!clientExist) {
                throw new Error('Cliente no existe')
            }
            //Verificar si el cliente es del vendedor
            if (clientExist.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            } 
            //Revisar si el stock está disponible
            for await (const article of input.order){
                const { id } = article,
                product = await Products.findById(id);
                //console.log(await Products.findById(id));
                if(article.amount > product.stock) {
                    throw new Error(`Excede stock disponible(${product.stock}) del producto: ${product.name}`)
                }else {
                    product.stock = product.stock - article.amount;
                    await product.save();
                }
            }
            //Cear nuevo pedido
            const newOrder = new Orders(input);
            
            //Asignar Vendedor
            newOrder.vendor = ctx.user.id;
            
            //Guardar en BBDD
            const result = await newOrder.save();
            return result;
        },
        updateOrder: async (_, {id, input}, ctx) => {

            const {client} = input;
            //verificar si el pedido existe
            let orderExist = await Orders.findById(id);
            if (!orderExist) {
                throw new Error('Orden no existe')
            }

            //Si el cliente existe
            let clientExist = await Client.findById(client);
            if (!clientExist) {
                throw new Error('Cliente no existe')
            }

            // Si el cliente y el pedido pertenecen al vendedor
            if (clientExist.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            } 
            //Revisar stock
            if( input.order ){
                for await (const article of input.order){
                    const { id } = article,
                    product = await Products.findById(id);
                    //console.log(await Products.findById(id));
                    if(article.amount > product.stock) {
                        throw new Error(`Excede stock disponible(${product.stock}) del producto: ${product.name}`)
                    }else {
                        product.stock = product.stock - article.amount;
                        await product.save();
                    }
                }
            }

            //Guardar en BBDD
            const result = await Orders.findOneAndUpdate({_id: id}, input, { new: true})
            return result;
        },
        removeOrder: async (_, { id }, ctx) => {
            //Veridicar si existe
            let order = await Orders.findById(id);

            if (!order) {
                throw new Error('Cliente no existe')
            }

            //Verificar fue creado por el vendedor
            if (order.vendor.toString() !== ctx.user.id) {
                throw new Error('Cliente de otro vendedor');
            }

            //Eliminar
            order = await Orders.findOneAndDelete({ _id: id });
            return "Orden Eliminada";
        },
    }
}

module.exports = resolvers;