const pool = require('../Config/dataBase');

exports.getNotes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Notes');
        res.json(rows);
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
        const [result] = await pool.query('INSERT INTO Notes (notes) VALUES (?)', [notes]);
        res.json({ id: result.insertId, notes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNotes = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Notes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json({ message: 'Nota eliminada con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllNotes = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Notes');
        res.json({ message: `${result.affectedRows} notas eliminadas` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
