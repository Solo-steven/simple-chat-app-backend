const router = require('express').Router();
const userModel = require('../model/user');
const config = require('../config.json');
const JWT = require('jsonwebtoken');
/**
 * @swagger
 * path:
 *  /user
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
  const token = req.cookies.token;
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


module.exports = router;
