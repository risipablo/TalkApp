const NotesModel = require('../Models/notes');

exports.getNotes = async (req, res) => {
    try {
        const notes = await NotesModel.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addNotes = async (req, res) => {
    const { notes } = req.body;
    if (!notes) {
        return res.status(400).json({ error: 'Falta agregar una nota' });
    }
    try {
        const newNote = new NotesModel({
            notes, 
        });
        const result = await newNote.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
