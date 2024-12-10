const express = require('express')
const { getNotes, addNotes, deleteNotes, deleteAllNotes } = require('../Controllers/noteControllers')
const router = express.Router();

router.get('/notes',getNotes)
router.post('/notes',addNotes)
router.delete('/notes/:id',deleteNotes)
router.delete('/notes', deleteAllNotes)

module.exports = router;