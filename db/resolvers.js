const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tecnologia: 'JavaScript ES6',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];

//Resolvers
const resolvers = {
    Query: {
        //x: Objeto que contiene los resultados retornados por el resolver padre. Permite que existan consultas anidadas en graphQl. Nunca se utiliza.
        //input: Parametro que viene del TypeQuery en el schema dentro de la funcion obtenercursos.
        //Contex: es un objeto que se comparte o esta disponible entre todos los resolvers se utiliza para autenticaciones y datos que sean necesarios en todos lados.
        //Info: tiene informacion sobre la consulta actual. No se utiliza mucho.
        obtenerCursos: (x, {input}, context, info ) => {
            console.log({context});
            const resultados = cursos.filter(curso => curso.tecnologia === input.tecnologia);
            return resultados;
        },
        obtenerTecnologia: () => cursos,
    }
}
module.exports = resolvers;