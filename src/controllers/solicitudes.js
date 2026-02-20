import { pool } from '../config/db.js';

// 1. Crear una nueva solicitud
export const crearSolicitud = async (req, res) => {
    // Estos datos vienen del formulario en React
    // El 'solicitante' es el ID del usuario logueado
    const { solicitante, actividad, justificacion } = req.body;

    try {
        const query = `
            INSERT INTO solicitudes (solicitante, actividad, justificacion, estado) 
            VALUES (?, ?, ?, 'Pendiente')
        `;

        const [result] = await pool.query(query, [solicitante, actividad, justificacion]);

        res.status(201).json({
            message: "Solicitud creada con éxito y enviada al Vicepresidente.",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la solicitud", error: error.message });
    }
};

// 2. Acción del Vicepresidente (Aprobar/Rechazar)
export const decidirSolicitud = async (req, res) => {
    const { id } = req.params;
    const { estado, prioridad, responsable, observaciones } = req.body;

    try {
        // Si el estado es 'Rechazada', solo actualizamos estado y observaciones
        if (estado === 'Rechazada') {
            await pool.query(
                'UPDATE solicitudes SET estado = ?, observaciones = ? WHERE id = ?',
                ['Rechazada', observaciones, id]
            );
        }
        // Si es 'Aprobada', asignamos prioridad y responsable
        else if (estado === 'Aprobada') {
            await pool.query(
                'UPDATE solicitudes SET estado = ?, prioridad = ?, responsable = ?, observaciones = ? WHERE id = ?',
                ['Aprobada', prioridad, responsable, observaciones, id]
            );
        }

        res.json({ message: `Solicitud actualizada a: ${estado}` });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar la decisión", error: error.message });
    }
};

// 3. Obtener solicitudes (Con JOIN para ver los nombres del equipo)
export const getSolicitudes = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.*, 
                e1.nombre AS nombre_solicitante,
                e2.nombre AS nombre_responsable
            FROM solicitudes s
            LEFT JOIN equipo e1 ON s.solicitante = e1.id
            LEFT JOIN equipo e2 ON s.responsable = e2.id
            ORDER BY s.fecha_solicitud ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. (Opcional) Obtener una solicitud específica por ID
export const getSolicitudPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT  
                s.*, 
                e1.nombre AS nombre_solicitante,
                e2.nombre AS nombre_responsable
            FROM solicitudes s
            LEFT JOIN equipo e1 ON s.solicitante = e1.id
            LEFT JOIN equipo e2 ON s.responsable = e2.id
            WHERE s.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//actualizar solicitud para corregir lo digitado por el solicitante
export const actualizarSolicitud = async (req, res) => {
    const { id } = req.params;
    const { actividad, justificacion, observaciones } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE solicitudes SET actividad = ?, justificacion = ?, observaciones= ? WHERE id = ?',
            [actividad, justificacion, observaciones, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        res.json({ message: "Solicitud actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la solicitud", error: error.message });
    }
};

// Eliminar solicitud (Si el solicitante quiere retirar su solicitud antes de que sea revisada)
export const eliminarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM solicitudes WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        res.json({ message: "Solicitud eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la solicitud", error: error.message });
    }
};

export const getSolicitudesPorSolicitante = async (req, res) => {
    const { id } = req.params; // ID del solicitante
    try {
        const query = `
            SELECT 
                s.*, 
                e1.nombre AS nombre_solicitante,
                e2.nombre AS nombre_responsable
            FROM solicitudes s
            LEFT JOIN equipo e1 ON s.solicitante = e1.id
            LEFT JOIN equipo e2 ON s.responsable = e2.id
            WHERE s.solicitante = ?
            ORDER BY s.fecha_solicitud ASC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSolicitudesPorResponsable = async (req, res) => {
    const { id } = req.params; // ID del responsable
    try {
        const query = ` 

            SELECT 
                s.*, 
                e1.nombre AS nombre_solicitante,
                e2.nombre AS nombre_responsable
            FROM solicitudes s
            LEFT JOIN equipo e1 ON s.solicitante = e1.id
            LEFT JOIN equipo e2 ON s.responsable = e2.id
            WHERE s.responsable = ?
            ORDER BY s.fecha_solicitud ASC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSolicitudesPorSolicitanteYResponsable = async (req, res) => {
    const { id } = req.params; // ID del solicitante o responsable
    try {
        const query = `
            SELECT 
                s.*, 
                e1.nombre AS nombre_solicitante,
                e2.nombre AS nombre_responsable
            FROM solicitudes s
            LEFT JOIN equipo e1 ON s.solicitante = e1.id
            LEFT JOIN equipo e2 ON s.responsable = e2.id
            WHERE s.solicitante = ? OR s.responsable = ?
            ORDER BY s.fecha_solicitud ASC
        `;
        const [rows] = await pool.query(query, [id, id]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};