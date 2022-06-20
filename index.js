const http = require('http');
const url = require('url');
const fs = require('fs');

const { insertarUsuario, 
        listarUsuarios, 
        editarUsuario, 
        eliminarUsuario, 
        insertarTransferencia, 
        listarTransferencias } = require('./consultasBD');

http.createServer(async (req, res) => {

    /* ruta raiz / GET: Devuelve la aplicación cliente disponible en el apoyo de la prueba. */
    if (req.url == '/' && req.method == 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        const html = fs.readFileSync('./index.html', "utf8");
        res.end(html);
    }

    /* ruta /usuario POST: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL. */
    if (req.url == '/usuario' && req.method == 'POST') {
        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        try {
            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await insertarUsuario(datos);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            });
        } catch (error) {
            console.log("Se produjo un error al agregar un nuevo usuario.");
            console.log(error);
        }
    }

    /* ruta /usuarios GET: Devuelve todos los usuarios registrados con sus balances. */
    if (req.url == '/usuarios' && req.method == 'GET') {
        res.setHeader('Content-Type', 'application/json');
        
        try {
            const respuesta = await listarUsuarios();
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta.rows));
        } catch (error) {
            console.log("Se produjo un error al listar los usuarios desde la base de datos.");
            console.log(error);
        }
    }

    /* ruta /usuario PUT: Recibe los datos modificados de un usuario registrado y los actualiza. */
    if (req.url.startsWith('/usuario?') && req.method == 'PUT') {
        const { id } = url.parse(req.url, true).query;

        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        try {
            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await editarUsuario( datos, id );
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            });
        } catch (error) {
            console.log("Se produjo un error al intentar actualizar un usuario de la lista.");
            console.log(error);
        }
    }

    /* ruta /usuario DELETE: Recibe el id de un usuario registrado y lo elimina. */
    if (req.url.startsWith('/usuario?') && req.method == 'DELETE') {
        const { id } = url.parse(req.url, true).query;

        try {
            const respuesta = await eliminarUsuario(id);
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            console.log("Se produjo un error al intentar eliminar un usuario de la lista.");
            console.log(error);
        }
    }

    /* ruta /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe ocupar una transacción SQL. */
    if (req.url == '/transferencia' && req.method == 'POST') {
        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        try {
            req.on("end", async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await insertarTransferencia(datos);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            });
        } catch (error) {
            console.log("Se produjo un error al agregar una nueva transferencia.");
            console.log(error);
        }
    }

    /* ruta /transferencias GET: Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo. */
    if (req.url == '/transferencias' && req.method == 'GET') {
        res.setHeader('Content-Type', 'application/json');
        
        try {
            const respuesta = await listarTransferencias();
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta.rows));
        } catch (error) {
            console.log("Se produjo un error al listar las transferencias realizadas desde la base de datos.");
            console.log(error);
        }
    }

}).listen(3000, console.log("Servidor corriendo en http://localhost:3000/"));