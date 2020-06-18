const { Task } = require('../models');
class Controller{
    static add(req, res, next){
        Task.create({
            title: req.body.title,
            category: req.body.category,
            UserId: req.userData.id
        })
        .then(data => res.status(201).json(data))
        .catch(err => next(err));
    }
    static list(req, res, next){
        Task.findAll()
        .then(data => res.status(200).json(data))
        .catch(err => next(err));
    }
    static edit(req, res, next){
        Task.findByPk(req.params.id)
        .then(data => {
            if(!data){
                throw { name: 'DataNotFound' };
            } else {
                return Task.update({
                    title: req.body.title,
                    category: req.body.category
                }, {
                    where: { id: req.params.id },
                    returning: true, plain: true //return the new data
                })
            }
        })
        .then(data => res.status(200).json(data[1])) //return the second data since the first is unimportant to us
        .catch(err => next(err));
    }
    static del(req, res, next){
        let deleted;
        Task.findByPk(req.params.id)
        .then(data => {
            if(!data){
                throw { name: 'DataNotFound' };
            } else {
                deleted = data;
                return Task.destroy({ where: { id: req.params.id }});
            }
        })
        .then(data => res.status(200).json(deleted))
        .catch(err => next(err));
    }
    static details(req, res, next){
        Task.findByPk(req.params.id)
        .then(data => {
            if(!data){
                throw { name: 'DataNotFound' };
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => next(err));
    }
}
module.exports = Controller;