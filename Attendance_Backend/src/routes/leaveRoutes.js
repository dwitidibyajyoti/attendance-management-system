const express = require('express');
const router = express.Router();
const { addLeave, deleteLeave, getLeave } = require('../controllers/leaveController');

router.post('/add', addLeave);
router.delete('/:date', deleteLeave);
router.get('/',getLeave);

module.exports = router;
