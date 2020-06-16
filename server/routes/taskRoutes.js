const { route } = require('.');

const router = require('express').Router();
const Controller = require('../controllers/taskController');
const { authentication, authorization } = require('../middlewares/auth');

router.use(authentication);
router.post('/', Controller.add);
router.get('/', Controller.list);
router.put('/:id', authorization, Controller.edit);
router.delete('/:id', authorization, Controller.del);

module.exports = router;