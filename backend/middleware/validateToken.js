const env = require('../config/env')
const { verify } = require('jsonwebtoken')
const { User, User_Role, Role } = require('../models');
const { decodePayload } = require('../utils/token')

const validateUserToken = async (req, res, next) => {
  const accessToken = req.cookies['access-token'];
  console.log('Access Token in Middleware:', accessToken); // Log access token
  if (!accessToken) return res.status(400).json({ error: 'User is not authenticated' })

  try {
    const validToken = verify(accessToken, env.JWT_SECRET)
    console.log('Valid Token:', validToken); // Log valid token
    if (validToken) {
      req.authenticated = true
      req.user = validToken; // Attach the decoded token to the req object
      return next()
    } else {
      return res.status(400).json({ error: 'User is not authenticated' })
    }
  } catch (err) {
    return res.status(400).json({ error: 'Unknown error occurred' })
  }
}

const validateAdminToken = async (req, res, next) => {
  const accessToken = req.cookies["access-token"]
  if (!accessToken) return res.status(400).json({ error: 'User is not authenticated' })

  try {
    const validToken = verify(accessToken, env.JWT_SECRET)
    if (validToken) {
      const payload = decodePayload(accessToken)
      console.log('Payload:', payload); // Log payload
      if (!payload.uuid || !payload.role) return res.status(400).json({ error: 'User is not authenticated' })

      const role = await Role.findOne({
        include: {
          model: User_Role,
          include: {
            model: User,
            where: { uuid: payload.uuid }
          }
        }
      })
      if (role.dataValues.title !== 'admin') return res.status(400).json({ error: 'User does not have administrative privileges' })

      req.authenticated = true
      return next()
    } else {
      return res.status(400).json({ error: 'User is not authenticated' })
    }
  } catch (err) {
    return res.status(400).json({ error: 'Unknown error occurred' })
  }
}

module.exports = { validateUserToken, validateAdminToken }