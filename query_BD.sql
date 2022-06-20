CREATE DATABASE bancosolar;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY, 
	nombre VARCHAR(50),
	balance FLOAT CHECK (balance >= 0)
);

CREATE TABLE transferencias (
	id SERIAL PRIMARY KEY, 
	emisor INT, 
	receptor INT, 
	monto FLOAT, 
	fecha TIMESTAMP, 
	FOREIGN KEY (emisor) REFERENCES usuarios(id), 
	FOREIGN KEY (receptor) REFERENCES usuarios(id)
);

SELECT * FROM usuarios;

SELECT * FROM transferencias;

--creo dos usuarios de prueba.
INSERT INTO usuarios (nombre, balance) VALUES ('Felipe Muñoz', 100000);
INSERT INTO usuarios (nombre, balance) VALUES ('Alberto Muñoz', 200000);

--busco los id de los usuarios mediante sus nombres como serian guardados en la BD, 
--y como estaran listados en el formulario "Realiza una transferencia".
SELECT id FROM usuarios WHERE nombre = 'Felipe Muñoz';
SELECT id FROM usuarios WHERE nombre = 'Alberto Muñoz';

--realizo una prueba de agregar una transferencia indicando los id de emisor y receptor,
--tambien el monto y la fecha.
INSERT INTO transferencias (emisor, receptor, monto, fecha) 
VALUES ((SELECT id FROM usuarios WHERE nombre = 'Felipe Muñoz'),
		(SELECT id FROM usuarios WHERE nombre = 'Alberto Muñoz'), 
		25000, NOW());

--obtener la información para imprimirla en el formulario Tabla de transferencias. 
SELECT fecha, emisor, receptor, monto FROM transferencias;

--para obtener los nombres de emisor y receptor debo utilizar una consulta uniendo tablas.
--utilizando dos INNER JOIN se llama al "nombre" del emisor y receptor de la tabla usuarios.
SELECT TO_CHAR(tr.fecha, 'dd-mm-yyyy HH24:mm'), emi.nombre, rec.nombre, tr.monto
FROM transferencias AS tr
INNER JOIN usuarios AS emi
ON tr.emisor = emi.id
INNER JOIN usuarios AS rec
ON tr.receptor =  rec.id;

--para poder eliminar un usuario que ya tenga transacciones, 
--primero se debe eliminar los registros de emisor y receptor y luego el usuario.
DELETE FROM transferencias WHERE emisor=1;
DELETE FROM transferencias WHERE receptor=1;
DELETE FROM usuarios WHERE id=1;