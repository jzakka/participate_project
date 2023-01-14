const User = require('../models/user');

module.exports.getUsers = async (req, res, next) => {
    const email = req.query.email;
    const username = req.query.username;
    const where ={};

    if(email){
        where.email = email;
    }
    if(username){
        where.username = username;
    }
    const users = await User.findAll({
        where: where
    });

    return res.status(200).json(users);
};

module.exports.getUser = async (req,res,next) => {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);

    if(!user){
        return res.status(404);
    }

    return res.status(200).json(user);
}

module.exports.addUser = async (req,res,next)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    const newUser = await User.create({
        username: username,
        email: email,
        password: password
    });

    return res.status(200).json(newUser);
}; 