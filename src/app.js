import express, { json } from 'express';
import cors from 'cors';
import equipoRouter from './routes/equipo.js';
import solicitudesRoutes from './routes/solicitudes.js';
import actividadesRouter from './routes/actividades.js';
import loginRouter from './routes/login.js';


const app = express();

// Middlewares
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
// app.use(json());
// Para leer JSON del frontend

// Rutas (las crearemos a continuación)
app.use('/api/equipo', equipoRouter);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/actividades', actividadesRouter);
app.use('/api/login', loginRouter);
app.get('/', (req, res) => {
    //mostrar todas las rutas con sus métodos
    res.json({
        message: "Bienvenido a la API de Gestión de Tecnología",
        routes: {
            "/api/equipo": {
                "GET": "Obtener todo el equipo",
                "GET /:id": "Obtener un miembro del equipo por ID",
                "POST": "Crear un nuevo miembro del equipo",
                "PUT /:id": "Actualizar un miembro del equipo",
                "PATCH /:id": "Actualizar parcialmente un miembro del equipo",
                "DELETE /:id": "Eliminar un miembro del equipo",
                "GET /idapp/:id": "Obtener un miembro del equipo por ID de aplicación",
                "GET /funcionarios/app": "Obtener todos los funcionarios (Integrantes del equipo con rol 'Funcionario')"
            },
            "/api/solicitudes": {
                "GET": "Obtener todas las solicitudes",
                "GET /:id": "Obtener una solicitud específica por ID",
                "POST": "Crear una nueva solicitud",
                "PATCH /:id/decision": "Tomar una decisión sobre una solicitud (Aprobar/Rechazar)",
                "GET /solicitante/:id": "Obtener solicitudes por solicitante",
                "GET /responsable/:id": "Obtener solicitudes por responsable"
            },
            "/api/actividades": {
                "GET": "Obtener todas las actividades",
                "POST": "Crear una nueva actividad",
                "PUT /:id": "Actualizar una actividad",
                "DELETE /:id": "Eliminar una actividad",
                "PATCH /:id/estado": "Cambiar el estado de una actividad",
                "PATCH /:id/responsable": "Asignar un responsable a una actividad",
                "PATCH /:id/iniciar": "Iniciar una actividad",
                "PATCH /:id/completar": "Completar una actividad",
                "PATCH /:id/avance": "Modificar el avance de una actividad",
                "GET /estado/:estado": "Obtener actividades por estado",
                "GET /fecha/:fecha": "Obtener actividades por fecha",
                "GET /responsable/:responsable": "Obtener actividades por responsable",
                "GET /conteo/estado": "Obtener conteo de actividades por estado",
                "GET /conteo/responsable": "Obtener conteo de actividades por responsable",
                "GET /apoyos": "Obtener actividades con sus apoyos",
                "POST /apoyos": "Asignar un apoyo a una actividad"

            },
            "/api/login": {
                "POST": "Iniciar sesión"
            }
        }
    });
}
);
// app.use('/api/solicitudes', solicitudesRoutes);

export default app;