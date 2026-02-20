import { Router } from 'express';
import { crearSolicitud, decidirSolicitud, getSolicitudes, getSolicitudPorId, getSolicitudesPorSolicitante, getSolicitudesPorResponsable, getSolicitudesPorSolicitanteYResponsable } from '../controllers/solicitudes.js';

const solicitudesRouter = Router();

// Ver todas las solicitudes (Historial/Panel VP)
solicitudesRouter.get('/', getSolicitudes);

// Ver una solicitud específica por ID
solicitudesRouter.get('/:id', getSolicitudPorId);

// Crear una nueva solicitud (Cualquier miembro del equipo)
solicitudesRouter.post('/', crearSolicitud);

// Aprobar o Rechazar (Solo VP - En el futuro añadiremos un middleware de rol aquí)
solicitudesRouter.patch('/:id/decision', decidirSolicitud);

// En el futuro podríamos añadir rutas para que los responsables vean solo sus solicitudes asignadas, etc.
solicitudesRouter.get('/solicitante/:id', getSolicitudesPorSolicitante);

solicitudesRouter.get('/responsable/:id', getSolicitudesPorResponsable);

solicitudesRouter.get('/solicitanteYResponsable/:id', getSolicitudesPorSolicitanteYResponsable);


export default solicitudesRouter;