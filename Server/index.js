const express = require('express')
const cors = require('cors')
const notesRoutes = require('./Routes/notesRouter')
require('dotenv').config();

const app = express()
app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173', 'https://talk-app-eight.vercel.app', 'https://talkapp-e3bo.onrender.com'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH',
    credentials: true,
};
app.use(cors(corsOptions));


app.use('/api', notesRoutes)

app.listen(3001, () => {
    console.log('Servidor funcionando')
})

