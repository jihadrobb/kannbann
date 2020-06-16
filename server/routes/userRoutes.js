const { route } = require('.');

const router = require('express').Router();
const Controller = require('../controllers/userController');

router.post('/register', Controller.reg);
router.post('/login', Controller.login);
// router.post('/googleSign', Controller.gSign);

module.exports = router;