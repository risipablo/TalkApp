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


exports.deleteNotes = async (req,res) => {
    const {id} = req.params;
    try{
        const deleteNote = await NotesModel.findById(id)
        if(!deleteNote) {
            return res.status(404).json({error:'Note not found'})
        }
        const result = await NotesModel.findByIdAndDelete(id)
        res.json({ message: 'nota eliminada', result})
    } catch (err) {
        res.status(500).json({error: 'Server error: ' + err.message})
    }
}

exports.deleteAllNotes = async (req, res) => {
    try {
        const result = await NotesModel.deleteMany({}); // Elimina todas las tareas
        res.json({ message: `${result.deletedCount} tareas eliminadas`, result });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};