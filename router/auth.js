const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const router = require('express').Router();
const userModel = require('../model/user');
const config = require('../config.json');

function generateHash(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const passwordHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  return {passwordHash, salt};
};

function verifyPassword(password, salt, passwordHash) {
  const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  if (hash === passwordHash) return true;
  return false;
}
/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      description: login by email and password
 *      tags: [auth]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  description: email of user
 *                password:
 *                  type: string
 *                  description: password of user
 *      responses:
 *        200:
 *          description: login ok with JWT back
 *        404:
 *          description: email error, user not found
 *        402:
 *          description: password error,
 */

router.post('/login', async ( req, res) => {
  const {email, password} = req.body;
  const datas =await userModel.find({email: email});
  if (datas.length === 0) {
    return res.status(404).json({message: 'user not found'});
  }
  const data = datas[0];
  if (verifyPassword( password, data.salt, data.passwordHash)) {
    const token = JWT.sign({email}, config.JWT);
    return res.status(200).json({token});
  }
  return res.status(402).json({message: 'password error'});
});
/**
 * @swagger
 * paths:
 *  /auth/regitser:
 *    post:
 *      description: register a new user.
 *      tags: [auth]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                password:
 *                 type: string
 *      responses:
 *         200:
 *           description: register successfully
 *         400:
 *           description: email already registered or lock of parameters
 */
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  if (!name ||!password) {
    return res.status(400).json({message: 'Invalid username or password'});
  }
  const datas = await userModel.find({email: email});
  if (datas.length > 0) {
    return res.status(400).json({message: 'email already in use'});
  }
  const {passwordHash, salt} = generateHash(password);
  const user = await userModel({
    name,
    imgUrl: null,
    email,
    passwordHash,
    salt,
    friends: [],
  });
  user.save();
  res.status(200).json({});
});

router.post('/refresh', async (req, res) => {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({message: 'un-auth'});
  }
  return res.status(200).json({});
});


module.exports = router;
