import { pool } from "../config/db.js";

// 1. Crear una nueva actividad
export const crearActividad = async (req, res) => {
    const { tarea, tipo, padre, prioridad, responsable_id, estado, avance, solicitud_id } = req.body;

    try {
        const query = `
            INSERT INTO actividades (tarea, tipo, padre, prioridad, responsable_id, estado, avance, solicitud_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [tarea, tipo, padre, prioridad, responsable_id, "No iniciada", 0, solicitud_id]);

        res.status(201).json({
            message: "Actividad creada con éxito.",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la actividad", error: error.message });
    }
};

// 2. Obtener todas las actividades
export const getActividades = async (req, res) => {
    try {
        //Consultamos todas las actividades y unimos con el nombre del responsable y los apoyos mostrando una lista con los nombres de los apoyos separados por comas
        const query = `
           SELECT 
                a.*,
                e_resp.nombre AS nombre_responsable,
                GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos
            FROM actividades a
            LEFT JOIN equipo e_resp ON a.responsable_id = e_resp.id
            LEFT JOIN actividad_apoyos aa ON a.id = aa.actividad_id
            LEFT JOIN equipo e_apoyo ON aa.usuario_id = e_apoyo.id
            GROUP BY a.id
            ORDER BY a.fecha_inicio DESC;
        `;
        const [actividades] = await pool.query(query);

        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades", error: error.message });
    }
};

// 3. Actualizar una actividad
export const actualizarActividad = async (req, res) => {
    const { id } = req.params;
    const { tarea, tipo, padre, prioridad, responsable_id, estado, avance, solicitud_id } = req.body;

    try {
        const query = `
            UPDATE actividades 
            SET tarea = ?, tipo = ?, padre = ?, prioridad = ?, responsable_id = ?, estado = ?, avance = ?, solicitud_id = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [tarea, tipo, padre, prioridad, responsable_id, estado, avance, solicitud_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }

        res.json({ message: "Actividad actualizada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la actividad", error: error.message });
    }
};

// 4. Eliminar una actividad
export const eliminarActividad = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM actividades WHERE id = ?';
        const [result] = await pool.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json({ message: "Actividad eliminada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la actividad", error: error.message });
    }
};

// 5. Cambiar el estado de una actividad (Ej: Pendiente, En Progreso, Completada)
export const cambiarEstadoActividad = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Ej: "Pendiente", "En Progreso", "Completada"
    try {
        const query = 'UPDATE actividades SET estado = ? WHERE id = ?';
        const [result] = await pool.query(query, [estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json({ message: "Estado de la actividad actualizado con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado de la actividad", error: error.message });
    }
};

// 6. Asignar o cambiar el responsable de una actividad
export const asignarResponsableActividad = async (req, res) => {
    const { id } = req.params;
    const { responsable_id } = req.body; // ID del nuevo responsable
    try {
        const query = 'UPDATE actividades SET responsable_id = ? WHERE id = ?';

        const [result] = await pool.query(query, [responsable_id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        const query2 = `
        SELECT a.*, e.nombre AS nombre_responsable, GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            LEFT JOIN actividad_apoyos ap ON a.id = ap.actividad_id
            LEFT JOIN equipo e_apoyo ON ap.usuario_id = e_apoyo.id
            WHERE a.id = ?
        `
        const [activity] = await pool.query(query2, [id]);
        res.json({ message: "Responsable de la actividad actualizado con éxito.", data: activity });
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el responsable de la actividad", error: error.message });
    }
};

// 7. Obtener actividades por responsable
export const getActividadesPorResponsable = async (req, res) => {
    const { responsableId } = req.params; // ID del responsable
    try {
        const query = `
            SELECT a.*, e.nombre AS nombre_responsable, 
            GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos      
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            LEFT JOIN actividad_apoyos ap ON a.id = ap.actividad_id
            LEFT JOIN equipo e_apoyo ON ap.usuario_id = e_apoyo.id
            WHERE a.responsable_id = ?
        `;
        const [actividades] = await pool.query(query, [responsableId]);
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades por responsable", error: error.message });
    }
};

// 8. Obtener actividades por estado
export const getActividadesPorEstado = async (req, res) => {
    const { estado } = req.params; // Ej: "Pendiente", "En Progreso", "Completada"
    try {
        const query = `
            SELECT a.*, e.nombre AS nombre_responsable, GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos      
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            LEFT JOIN actividad_apoyos ap ON a.id = ap.actividad_id
            LEFT JOIN equipo e_apoyo ON ap.usuario_id = e_apoyo.id
            WHERE a.estado = ?  
        `;
        const [actividades] = await pool.query(query, [estado]);
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades por estado", error: error.message });
    }
};

// 9. Obtener actividades por fecha (Ej: actividades que inician después de una fecha dada)
export const getActividadesPorFecha = async (req, res) => {
    const { fecha } = req.params; // Ej: "2024-01-01"
    try {
        const query = ` 
            SELECT a.*, e.nombre AS nombre_responsable, GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos       
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            LEFT JOIN actividad_apoyos ap ON a.id = ap.actividad_id
            LEFT JOIN equipo e_apoyo ON ap.usuario_id = e_apoyo.id
            WHERE a.fecha_inicio >= ?  
        `;
        const [actividades] = await pool.query(query, [fecha]);
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades por fecha", error: error.message });
    }
};

// 10. Obtener el conteo de actividades por estado (Ej: cuántas actividades están pendientes, en progreso, completadas)
export const getConteoActividadesPorEstado = async (req, res) => {
    try {
        const query = ` 
            SELECT estado, COUNT(*) AS conteo
            FROM actividades
            GROUP BY estado
        `;
        const [conteo] = await pool.query(query);
        res.json(conteo);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el conteo de actividades por estado", error: error.message });
    }
};

// 11. Obtener el conteo de actividades por responsable (Ej: cuántas actividades tiene cada responsable)
export const getConteoActividadesPorResponsable = async (req, res) => {
    try {
        const query = `
            SELECT e.nombre AS nombre_responsable, COUNT(*) AS conteo
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            GROUP BY a.responsable
        `;
        const [conteo] = await pool.query(query);
        res.json(conteo);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el conteo de actividades por responsable", error: error.message });
    }
};

//12. Iniciar una actividad
export const iniciarActividad = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE actividades SET estado = ?, fecha_inicio = NOW() WHERE id = ?';
        const [result] = await pool.query(query, ['En curso', id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json({ message: "Actividad iniciada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar la actividad", error: error.message });
    }
};
//13. Completar una actividad
export const completarActividad = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE actividades SET estado = ?, fecha_final = NOW() WHERE id = ?';
        const [result] = await pool.query(query, ['Completada', id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json({ message: "Actividad completada con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al completar la actividad", error: error.message });
    }
};

//14. Modificar avance de una actividad
export const modificarAvanceActividad = async (req, res) => {
    const { id } = req.params;
    const { avance } = req.body; // Porcentaje de avance (0-100)
    try {
        const query = 'UPDATE actividades SET avance = ? WHERE id = ?';
        const [result] = await pool.query(query, [avance, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json({ message: "Avance de la actividad actualizado con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el avance de la actividad", error: error.message });
    }
};

// Obtener una actividad por ID
export const getActividadPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.*, e.nombre AS nombre_responsable, GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos, GROUP_CONCAT(e_apoyo.id SEPARATOR ', ') AS ids_apoyos
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            LEFT JOIN actividad_apoyos ap ON a.id = ap.actividad_id
            LEFT JOIN equipo e_apoyo ON ap.usuario_id = e_apoyo.id
            WHERE a.id = ?
        `;
        const [result] = await pool.query(query, [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Actividad no encontrada." });
        }
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la actividad", error: error.message });
    }
};

// Agregar a la tabla de actividad_apoyo cuando se asigna personal de apoyo a una actividad
export const asignarApoyoActividad = async (req, res) => {
    const { actividad_id, usuario_id } = req.body;
    try {
        const query = 'INSERT INTO actividad_apoyos (actividad_id, usuario_id) VALUES (?, ?)';
        await pool.query(query, [actividad_id, usuario_id]);
        res.json({ message: "Personal de apoyo asignado a la actividad con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al asignar personal de apoyo a la actividad", error: error.message });
    }
};

// Obtener actividades por apoyo (Ej: obtener todas las actividades en las que un miembro del equipo está brindando apoyo)
export const getActividadesPorApoyo = async (req, res) => {
    const { apoyoId } = req.params;
    try {
        const query = `
            SELECT a.*, e.nombre AS nombre_responsable, GROUP_CONCAT(e_apoyo.nombre SEPARATOR ', ') AS nombres_apoyos
            FROM actividades a
            JOIN equipo e ON a.responsable_id = e.id
            JOIN actividad_apoyos aa ON a.id = aa.actividad_id
            LEFT JOIN equipo e_apoyo ON aa.usuario_id = e_apoyo.id
            WHERE aa.usuario_id = ?
        `;
        const [result] = await pool.query(query, [apoyoId]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades por apoyo", error: error.message });
    }
};

// Asignar multiples apoyos a una actividad
export const asignarMultiplesApoyos = async (req, res) => {
    const { actividad_id, usuario_ids } = req.body;
    try {
        const query = 'INSERT INTO actividad_apoyos (actividad_id, usuario_id) VALUES (?, ?)';

        for (const usuario_id of usuario_ids) {
            await pool.query(query, [actividad_id, usuario_id]);
        }

        res.json({ message: "Personal de apoyo asignado a la actividad con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al asignar personal de apoyo a la actividad", error: error.message });
    }
};

export const eliminarApoyo = async (req, res) => {
    const { id, apoyo_id } = req.params;
    try {
        const query = 'DELETE FROM actividad_apoyos WHERE actividad_id = ? AND usuario_id = ?';
        const [result] = await pool.query(query, [id, apoyo_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Apoyo no encontrado en la actividad." });
        }
        res.json({ message: "Apoyo eliminado de la actividad con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el apoyo de la actividad", error: error.message });
    }
}
