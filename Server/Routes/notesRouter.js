const express = require('express')
const { getNotes, addNotes } = require('../Controllers/noteControllers')
const router = express.Router();

router.get('/notes',getNotes)
router.post('/notes',addNotes)

module.exports = router;