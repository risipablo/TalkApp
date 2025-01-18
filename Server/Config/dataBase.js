// const mongoose = require('mongoose')
// require('dotenv').config()

// const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGODB)
//         console.log('Conexión exitosa con MongoDB')
//     } catch (err) {
//         console.error('Conexión fallida: ' + err)
//     }
// }

// module.exports = connectDB;



const mysql = require('mysql2/promise')
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones simultáneas
    queueLimit: 0,       // Sin límite en la cola de conexiones
});

module.exports = pool;

