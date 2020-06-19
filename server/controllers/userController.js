const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
class Controller{
    static reg(req, res, next){
        User.findOne({ where: { email: req.body.email }})
        .then(data => {
            if(data){
                throw { name: 'UserAlreadyExists' };
            } else {
                return User.create({
                    email: req.body.email,
                    password: req.body.password
                });
            }
        })
        .then(data => {
            res.status(201).json(data);
        })
        .catch(err => {
            next(err);
        });
    }
    static login(req, res, next){
        User.findOne({ where: { email: req.body.email }})
        .then(data => {
            if(!data){
                throw { name: 'EmailNotFound' };
            } else if(bcrypt.compareSync(req.body.password, data.password)){
                const token = jwt.sign({
                    id: data.id,
                    email: data.email
                }, process.env.JWT_SECRET );
                return res.status(200).json({ id: data.id, email: data.email, token });
            } else {
                throw { name: 'WrongPassword' };
            }
            
        })
        .catch(err => {
            next(err);
        });
    }
    static gSign(req, res, next){
        let { id_token } = req.body;
        let email;
        const client = new OAuth2Client(process.env.GOOGLE_API);
        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_API
        })
        .then(ticket => {
            email = ticket.getPayload().email;
            return User.findOne({ where: { email }});
        })
        .then(data => {
            if(data){
                const token = jwt.sign({
                    id: data.id,
                    email: data.email
                }, process.env.JWT_SECRET );
                res.status(200).json({ id: data.id, email: data.email, token });
            } else {
                return User.create({
                    email,
                    password: 'defaultPassword'
                })
            }
        })
        .then(data => {
            const token = jwt.sign({
                id: data.id,
                email: data.email
            }, process.env.JWT_SECRET );
            return res.status(201).json({ id: data.id, email: data.email, token });
        })
        .catch(err => {
            next(err);
        })
    }
}
module.exports = Controller;