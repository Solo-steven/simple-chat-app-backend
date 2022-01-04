const router = require('express').Router();
const JWT = require('jsonwebtoken');
const config = require('../config.json');
const messageModel = require('../model/message');
/**
 * @swagger
 * paths:
 *  /message?sender=name& reciver=name:
 *    get:
 *      description: Get message accroding to sender and reciver
 *      tags: [message]
 *      parameters:
 *         - in: query
 *           name: sender
 *           schema:
 *             type: string
 *         - in: query
 *           name: reciver
 *           schema:
 *             type: string
 *      responses:
 *         200:
 *          description: Get Message successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   sender:
 *                     type: string
 *                   reciver:
 *                     type: string
 */
router.get('/', async ( req, res) => {
  const {sender, reciver} = req.query;
  if (!sender||!reciver) {
    return res.status(400).json({messgae: 'lock of parameters'});
  }
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({message: 'lock of token'});
  }
  const {email} = JWT.verify(token, config.JWT);
  if (email !== sender) {
    return res.status(403).json({message: 'sender error'});
  }
  const fromSender=await messageModel.find({sender, reciver});
  const fromReciver=await messageModel.find({sender: reciver, reciver: sender});
  const data = [...fromSender, ...fromReciver];
  res.status(200).json(data);
});

module.exports = router;
