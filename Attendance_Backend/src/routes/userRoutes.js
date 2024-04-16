const express = require('express');
const router = express.Router();
const { getAllUsers, getUsers , deleteUser , editUsers,getUserById} = require('../controllers/userController');

router.get('/', getAllUsers);

router.get('/allusers',getUsers);

router.delete('/delete/:userId', deleteUser);

router.put('/edit/:userId', editUsers);

router.get('/user/:userId',getUserById);

module.exports = router;
