import app from './src/app.js';
import dotenv from 'dotenv';
import { pool, externalPool } from './src/config/db.js';

// Cargamos las variables de entorno (.env)
dotenv.config();

// Definimos el puerto (usamos el del .env o el 3000 por defecto)
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
//conexion a la base de datos


// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 Servidor corriendo en: http://${HOST}:${PORT}`);
    try {
        pool.getConnection()
            .then(connection => {
                console.log('✅ Conexión a la base de datos exitosa');

                // connection.release();
            })
    } catch (error) {
        console.error('❌ Error inesperado al iniciar el servidor:', error.message);

        // process.exit(1); // Salimos del proceso con error
    }
    try {
        externalPool.getConnection()
            .then(connection => {
                console.log('✅ Conexión a la base de datos externa exitosa');
                // connection.release();
            })
    }
    catch (error) {
        console.error('❌ Error inesperado al conectar a la base de datos externa:', error.message);
        console.log(`==========================================`)
        // process.exit(1); // Salimos del proceso con error
    }
});