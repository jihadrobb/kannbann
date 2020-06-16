const router = require('express').Router();
const userRouter = require('./userRoutes');
const taskRouter = require('./taskRoutes');


router.use('/', userRouter);
router.use('/tasks', taskRouter);

module.exports = router;