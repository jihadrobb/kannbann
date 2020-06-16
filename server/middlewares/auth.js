const { User, Task } = require('../models');
const jwt = require('jsonwebtoken');

function authentication(req, res, next){
    const { token } = req.headers;
    if(!token){
        next({ name: 'TokenNotFound' });
    } else {
        req.userData = jwt.verify(token, process.env.JWT_SECRET);
        User.findByPk(req.userData.id)
        .then(data => {
            if(!data){
                throw { name: 'UserNotFound' };
            } else {
                next();
            }
        })
        .catch(err => next(err));
    }
}

function authorization(req, res, next){
    Task.findByPk(req.params.id)
    .then(data => {
        if(!data){
            throw { name: 'DataNotFound' };
        } else if(data.UserId !== req.userData.id){
            throw { name: 'Unauthorized' };
        } else {
            next();
        }
    })
    .catch(err => next(err));
}

module.exports = { authentication, authorization };