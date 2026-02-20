import e from 'express';
import { externalPool } from '../config/db.js';

export const login = async (req, res) => {
    const { correo, clave } = req.body;

    try {
        // Verificar en la base de datos externa (aplicativo funcionarios) si el usuario existe y las credenciales son correctas
        const [externalUser] = await externalPool.query(
            'SELECT * FROM usuarios WHERE correo = ? AND clave = ?',
            [correo, clave]
        );
        if (externalUser.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas en el aplicativo funcionarios" });
        }

        const user = externalUser[0];

        // Obtener el nombre del empleado y su cargo usando el ID del empleado asociado al usuario
        const [empleado] = await externalPool.query(
            'SELECT e.id, e.nombres as nombres_empleados, e.apellidos as apellidos_empleados, c.nombre as nombre_cargo FROM empleados e JOIN cargos c ON e.Cargos_id = c.id WHERE e.id = ?',
            [user.Empleados_id]
        );
        if (empleado.length === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.json({
            message: "Login exitoso",
            user: { id: empleado[0].id, nombre: empleado[0].nombres_empleados + " " + empleado[0].apellidos_empleados, cargo: empleado[0].nombre_cargo }
        });

    } catch (error) {
        res.status(500).json({ message: "Error en la conexión", error: error.message });
    }
};
