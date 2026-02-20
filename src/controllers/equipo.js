import { externalPool, pool } from '../config/db.js';

// Obtener todos los integrantes para el listado y tarjetas
export const getAllEquipo = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nombre, cargo, rol, foto FROM equipo'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el equipo", error: error.message });
    }
};

// Obtener un integrante por ID (Útil para perfiles o validaciones)
export const getEquipoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM equipo WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Integrante no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Crear un nuevo integrante del equipo
export const createEquipoMember = async (req, res) => {
    const { nombre, cargo, rol, foto, id_aplicativo } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO equipo (nombre, cargo, rol, foto, id_aplicativo) VALUES (?, ?, ?, ?, ?)',
            [nombre, cargo, rol, foto, id_aplicativo]
        );
        res.status(201).json({ id: result.insertId, message: "Integrante creado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el integrante", error: error.message });
    }
};

// Actualizar un integrante del equipo
export const updateEquipoMember = async (req, res) => {
    const { id } = req.params;
    const { nombre, cargo, rol, foto, id_aplicativo } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE equipo SET nombre = ?, cargo = ?, rol = ?, foto = ?, id_aplicativo = ? WHERE id = ?',
            [nombre, cargo, rol, foto, id_aplicativo, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Integrante no encontrado" });
        }
        res.json({ message: "Integrante actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el integrante", error: error.message });
    }
};

// Actualizar parcialmente un integrante del equipo (PATCH)
export const patchEquipoMember = async (req, res) => {
    const { id } = req.params;
    const { nombre, cargo, rol, foto, id_aplicativo } = req.body;
    try {
        // Primero obtenemos el integrante actual para no perder datos no enviados
        const [rows] = await pool.query(
            'SELECT nombre, cargo, rol, foto, id_aplicativo FROM equipo WHERE id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Integrante no encontrado" });
        }
        const current = rows[0];

        // Usamos los valores enviados o mantenemos los actuales
        const updatedNombre = nombre || current.nombre;
        const updatedCargo = cargo || current.cargo;
        const updatedRol = rol || current.rol;
        const updatedFoto = foto || current.foto; // Mantenemos la foto actual, ya que no se puede actualizar con PATCH
        const updatedIdAplicativo = id_aplicativo || current.id_aplicativo;

        const [result] = await pool.query(
            'UPDATE equipo SET nombre = ?, cargo = ?, rol = ?, foto = ?, id_aplicativo = ? WHERE id = ?',
            [updatedNombre, updatedCargo, updatedRol, updatedFoto, updatedIdAplicativo, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Integrante no encontrado" });
        }
        res.json({ message: "Integrante actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el integrante", error: error.message });
    }
};

// Eliminar un integrante del equipo
export const deleteEquipoMember = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM equipo WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Integrante no encontrado" });
        }
        res.json({ message: "Integrante eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el integrante", error: error.message });
    }
};

// Obtener un integrante por ID de aplicación (Útil para validaciones en solicitudes, actividades, etc.)
export const getEquipoByIdApp = async (req, res) => {
    const { idapp } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM equipo WHERE id_aplicativo = ?',
            [idapp]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Integrante no encontrado para el ID de aplicación proporcionado" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Obtener todos los funcionarios activos con su cargo (Útil para formularios de selección en el frontend) La base de datos externa , la tabla se llama empleados y tiene los campos id, nombres, apellidos, correo, foto, id_cargo, estado. La tabla cargos tiene los campos id y nombre.
export const getFuncionarios = async (req, res) => {
    try {
        const [rows] = await externalPool.query(
            'SELECT e.id, CONCAT(e.nombres, " ", e.apellidos) AS nombre_completo, e.email, hdv.foto, c.nombre AS cargo ' +
            'FROM empleados e ' +
            'JOIN cargos c ON e.Cargos_id = c.id ' +
            'LEFT JOIN hojasdevidas hdv ON e.id = hdv.empleados_id ' +
            'WHERE e.estado = "Activo"' +
            'ORDER BY e.id'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los funcionarios", error: error.message });
    }
};