import { Router } from 'express';
const equipoRouter = Router();

import {
    getAllEquipo,
    getEquipoById,
    createEquipoMember,
    updateEquipoMember,
    deleteEquipoMember,
    patchEquipoMember,
    getEquipoByIdApp,
    getFuncionarios
} from '../controllers/equipo.js';

// Rutas para el equipo
equipoRouter.get('/', getAllEquipo);
equipoRouter.get('/:id', getEquipoById);
equipoRouter.post('/', createEquipoMember);
equipoRouter.put('/:id', updateEquipoMember);
equipoRouter.patch('/:id', patchEquipoMember);
equipoRouter.delete('/:id', deleteEquipoMember);
equipoRouter.get('/idapp/:idapp', getEquipoByIdApp);
equipoRouter.get('/funcionarios/todos', getFuncionarios);

export default equipoRouter;