const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    notes: { 
        type: String,
        required: true,
    },
});

const NotesModel = mongoose.model('Note', notesSchema);
module.exports = NotesModel;
