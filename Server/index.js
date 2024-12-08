const express = require('express');
const connectDB = require('./Config/dataBase');
const cors = require('cors');
const notesRoutes = require('./Routes/notesRouter');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH',
    credentials: true,
};
app.use(cors(corsOptions));

connectDB();

app.use('/api', notesRoutes);

app.listen(3001, () => {
    console.log('Servidor funcionando correctamente');
});
