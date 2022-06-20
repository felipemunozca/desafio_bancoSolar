const { Pool } = require('pg');

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
    const eliminarEmisor = {
        text: `DELETE FROM transferencias WHERE emisor = ${id} RETURNING *;`,
    };

    const eliminarReceptor = {
        text: `DELETE FROM transferencias WHERE receptor = ${id} RETURNING *;`,
    };

    const eliminarUsuario = {
        text: `DELETE FROM usuarios WHERE id = ${id} RETURNING *;`,
    };

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
    const actualizarRestar = {
        text: 'UPDATE usuarios SET balance = balance - $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [ datos[0], datos[2] ],
    };

    const actualizarSumar = {
        text: 'UPDATE usuarios SET balance = balance + $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [ datos[1], datos[2] ],
    };

    const agregarTransferencia = {
        rowMode: "array",
        text:  "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuarios WHERE nombre = $1), (SELECT id FROM usuarios WHERE nombre = $2), $3, NOW()) RETURNING *;",
        values: [ datos[0], datos[1], datos[2] ],
    };

    try {
        await pool.query("BEGIN");

        console.log("Comienza la transacción...");

        await pool.query(actualizarRestar);

        await pool.query(actualizarSumar);

        await pool.query(agregarTransferencia);

        await pool.query("COMMIT");

        console.log('¡La transacción se realizó con éxito!');

        return actualizarRestar, actualizarSumar, agregarTransferencia;
    } catch (error) {
        await pool.query("ROLLBACK");

        console.log('La transacción no se pudo realizar.');
        console.log(error.code);
        console.log(error.message);
        return error;
    }
}

const listarTransferencias = async () =>{
    const consulta = {
        rowMode: 'array',
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