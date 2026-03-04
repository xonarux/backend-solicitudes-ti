import { crearActividad, getActividades, getActividadPorId, getActividadesPorEstado, getActividadesPorFecha, getActividadesPorResponsable, getConteoActividadesPorEstado, getConteoActividadesPorResponsable, eliminarActividad, actualizarActividad, cambiarEstadoActividad, asignarResponsableActividad, iniciarActividad, completarActividad, modificarAvanceActividad, getActividadesPorApoyo, asignarApoyoActividad, asignarMultiplesApoyos, eliminarApoyo, buscarActividadesHijas, agregarEvidenciaActividad } from '../controllers/actividades.js';
import { Router } from 'express';

const actividadesRouter = Router();

// Rutas para actividades
actividadesRouter.post('/', crearActividad);
actividadesRouter.get('/', getActividades);
actividadesRouter.get('/:id', getActividadPorId);
actividadesRouter.get('/consultar/estado/:estado', getActividadesPorEstado);
actividadesRouter.get('/fecha/:fecha', getActividadesPorFecha);
actividadesRouter.get('/responsable/:responsableId', getActividadesPorResponsable);
actividadesRouter.get('/conteo/estado', getConteoActividadesPorEstado);
actividadesRouter.get('/conteo/responsable', getConteoActividadesPorResponsable);
actividadesRouter.delete('/:id', eliminarActividad);
actividadesRouter.put('/:id', actualizarActividad);
actividadesRouter.patch('/:id/estado', cambiarEstadoActividad);
actividadesRouter.patch('/:id/responsable', asignarResponsableActividad);
actividadesRouter.patch('/:id/iniciar', iniciarActividad);
actividadesRouter.patch('/:id/completar', completarActividad);
actividadesRouter.patch('/:id/avance', modificarAvanceActividad);
actividadesRouter.get("/apoyos/:apoyoId", getActividadesPorApoyo);
actividadesRouter.post("/apoyos", asignarMultiplesApoyos);
actividadesRouter.delete("/:id/apoyos/:apoyo_id", eliminarApoyo);
//buscar actividades hijas de una actividad padre
actividadesRouter.get("/hijas/:id", buscarActividadesHijas);
actividadesRouter.patch("/:id/evidencias", agregarEvidenciaActividad);


export default actividadesRouter;