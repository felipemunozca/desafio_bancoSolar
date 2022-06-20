/* Se utiliza un destructoring para llamar a la clase Pool */
const { Pool } = require('pg');

/* Se crea la constante pool a la que se le asignaran los valores para conectarse a la BD. */
const pool = new Pool({
    user: 'felipe',
    host: 'localhost',
    password: '123456',
    database: 'bancosolar',
    port: '5432',
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

const insertarUsuario = async (datos) => {
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *;",
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        console.log("¡Usuario registrado!");
        return result;
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        return error; 
    }
}

const listarUsuarios = async () =>{
    /* ordenar los usuarios de forma ascendiente por el id. */
    const consulta = {
        text: "SELECT * FROM usuarios ORDER BY id;",
    };

    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        return error; 
    }
}

const editarUsuario = async (datos, id) => {
    /* se reciben dos variables desde el formulario, los datos y el id. Se utilizan por separado para evitar errores en la lectura de las variables. */
    const consulta = {
        text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${id} RETURNING *;`,
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        console.log("¡Usuario actualizado!");
        return result;
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        return error; 
    }
};

const eliminarUsuario = async (id) => {
    /* para eliminar al usuario, lo primero es eliminar cualquier registro que tenga en la columna emisor y receptor, para evitar errores con una llave ya en uso. */
    /* Despues de eso, se puede eliminar el usuario desde la tabla usuarios. */
    const eliminarEmisor = {
        text: `DELETE FROM transferencias WHERE emisor = ${id} RETURNING *;`,
    };

    const eliminarReceptor = {
        text: `DELETE FROM transferencias WHERE receptor = ${id} RETURNING *;`,
    };

    const eliminarUsuario = {
        text: `DELETE FROM usuarios WHERE id = ${id} RETURNING *;`,
    };

    /* se crean 3 variables para pasarle las tres consultas, se debe respetar el orden, eliminarUsuario debe ejecutarse al final, sino se producira un error. */
    /* cada query utilizara el await para esperar a que se cumpla antes de continuar.  */
    try {
        const resultado_1 = await pool.query(eliminarEmisor);
        const resultado_2 = await pool.query(eliminarReceptor);
        const resultado_3 = await pool.query(eliminarUsuario);
        console.log("¡Usuario eliminado!");
        return resultado_1, resultado_2, resultado_3;
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        return error;
    }
}

const insertarTransferencia = async (datos) => {

    /* Se crean dos intrucciones SQL para ajustar los valores del balance de cada usuario, una para sumar y otra para restar el monto. */
    /* las posiciones del arreglo seran: */
    /* datos[0] es emisor, datos[1] es receptor, datos[2] es monto. */
    const actualizarRestar = {
        text: 'UPDATE usuarios SET balance = balance - $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [ datos[0], datos[2] ],
    };

    const actualizarSumar = {
        text: 'UPDATE usuarios SET balance = balance + $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [ datos[1], datos[2] ],
    };

    /* IMPORTANTE: */
    /* se debe utilizar rowMode como "array" para recibir los rows en formato array, ya que por defecto es en formato json. */
    /* la variable datos cargara la posicion de cada arreglo en la consulta sql. */
    const agregarTransferencia = {
        rowMode: "array",
        text:  "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuarios WHERE nombre = $1), (SELECT id FROM usuarios WHERE nombre = $2), $3, NOW()) RETURNING *;",
        values: [ datos[0], datos[1], datos[2] ],
    };

    /* Otra forma de hacer la misma consulta */
    /*
    const emisor = datos[0];
    const receptor = datos[1];
    const monto = datos[2];

    const agregarTransferencia = {
        rowMode: "array",
        text:  `INSERT INTO transferencias (emisor, receptor, monto, fecha) 
                VALUES ((SELECT id FROM usuarios WHERE nombre = '${emisor}'), 
                        (SELECT id FROM usuarios WHERE nombre = '${receptor}'), 
                ${monto}, NOW()) RETURNING *;`,
    };
    */

    try {
        /* se abre la transaccion con begin, si el codigo se ejecuta correctamente, se guarda la informacion en la bd con commit. */
        await pool.query("BEGIN");

        console.log("Comienza la transacción...");

        await pool.query(actualizarRestar);

        await pool.query(actualizarSumar);

        await pool.query(agregarTransferencia);

        await pool.query("COMMIT");

        console.log('¡La transacción se realizó con éxito!');

        return actualizarRestar, actualizarSumar, agregarTransferencia;
    } catch (error) {
        /* Si la transaccion falla, se vuelve atras con rollback. */
        await pool.query("ROLLBACK");

        console.log('La transacción no se pudo realizar.');
        console.log(error.code);
        console.log(error.message);
        return error;
    }
}

const listarTransferencias = async () =>{
    const consulta = {
        /* se debe utilizar rowMode como "array" para recibir los rows en formato array, ya que por defecto es en formato json. */
        rowMode: 'array',
        //text: "SELECT fecha, emisor, receptor, monto FROM transferencias;",
        text:  `SELECT TO_CHAR(tr.fecha, 'dd-mm-yyyy HH24:mm'), emi.nombre, rec.nombre, tr.monto FROM transferencias AS tr
                INNER JOIN usuarios AS emi ON tr.emisor = emi.id 
                INNER JOIN usuarios AS rec ON tr.receptor =  rec.id;`,
    };

    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        return error; 
    }
}

module.exports = {  
    insertarUsuario,
    listarUsuarios,
    editarUsuario,
    eliminarUsuario,
    insertarTransferencia,
    listarTransferencias
}