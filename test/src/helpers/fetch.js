const fetch = require('node-fetch')
var jwt = require('jsonwebtoken')

function makeJwt(userId) {
  return jwt.sign(
    {
      role: 'web_anon',
      user_id: userId
    },
    process.env.PGRST_JWT_SECRET
  )
}

module.exports = {
  get: async (path, userId) => {
    const response = await fetch(`${process.env.PGRST_API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${makeJwt(userId)}`
      }
    })
    return response.json()
  },

  post: async (path, userId, json) => {
    return fetch(`${process.env.PGRST_API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${makeJwt(userId)}`
      },
      body: JSON.stringify(json)
    })
  }
}
