const router = require('express').Router();
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const userModel = require('../model/user');
const config = require('../config.json');

function generateHash(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {passwordHash, salt };
};

function verifyPassword(password, salt, passwordHash) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if(hash === passwordHash)
        return true;
    return false;
}

router.post('/login', async( req, res) => {
    const { email, password } = req.body;
    const datas =  await userModel.find({email: email});
    if(datas.length === 0) return res.status(404).json({message: "user not found"});
    const data = datas[0];
    if(verifyPassword( password, data.salt, data.passwordHash)){
        const cookie = JWT.sign({ email }, config.JWT);
        res.cookie("token", cookie, {
            httpOnly: true
        });
        return res.status(200).json();
    }
    return res.status(402).json({ message: "password error" });
});

router.post("/register", async(req, res) => {
    const {  name,  email,  password } = req.body;
    if(!name ||  !password)
        return res.status(400).json({message: "Invalid username or password"});
    const datas = await userModel.find({ email: email });
    if(datas.length > 0)
        return res.status(400).json({message: "email already in use"});

    const { passwordHash, salt } = generateHash(password);
    const user = await userModel({
        name,
        imgUrl: null,
        email, 
        passwordHash,
        salt,
        friends: []
    });
    user.save();
    res.status(200).json({})
});


module.exports = router;
