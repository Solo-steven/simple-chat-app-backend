const router = require('express').Router();
const userModel = require('../model/user');
const config = require('../config.json');
const JWT = require('jsonwebtoken');
/**
 * @swagger
 * paths:
 *  /user:
 *   get:
 *    description: get user by JWT cookie
 *    tags: [user]
 *    responses:
 *      200:
 *        description: get user by JWT cookie successfully
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                  type: string
 *                 imgUrl:
 *                  type: string
 *                 email:
 *                   type: string
 *                 friends:
 *                   type: array
 *                   items:
 *                      type: object
 *                      properties:
 *                        name:
 *                          type: string
 *                        imgUrl:
 *                          type: string
 *                        email:
 *                          type: string
 */
router.get('/', async ( req, res) => {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({message: 'un-auth'});
  }
  try {
    const {email} = JWT.verify(token, config.JWT );
    const user = (await userModel.find({email: email}))[0];
    const friends = [];
    for (const friend of user.friends) {
      const data = (await userModel.find({email: friend}))[0];
      friends.push({
        name: data.name,
        imgUrl: data.imgUrl,
        email: data.email,
      });
    }
    return res.status(200).json({
      name: user.name,
      imgUrl: user.imgUrl,
      email: user.email,
      friends,
    });
  } catch (error) {
    return res.status(401).json({message: 'un-auth'});
  }
});

router.post('/friend', async ( req, res) => {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({message: 'un-auth'});
  }
  try {
    const {email} = JWT.verify(token, config.JWT );
    const {friendEmail} = req.body;
    const user = (await userModel.find({email: email}))[0];
    if (!user) {
      return res.status(404).json({message: 'user not find'});
    }
    const friend = (await userModel.find({email: friendEmail}))[0];
    if (!friend) {
      return res.status(404).json({message: 'friend not find'});
    }
    if (user.friends.indexOf(friendEmail)>-1) {
      return res.status(400).json({message: 'friend already exists'});
    }
    user.friends.push(friendEmail);
    user.save();
    return res.status(200).json({});
  } catch (error) {
    return res.status(401).json({message: 'un-auth'});
  }
});

module.exports = router;
