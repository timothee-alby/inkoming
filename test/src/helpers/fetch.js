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

async function request(method, path, userId, body) {
  return fetch(`${process.env.PGRST_API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${makeJwt(userId)}`
    },
    body
  })
}

async function get(path, userId) {
  const response = await request('GET', path, userId)
  return response.json()
}

async function post(path, userId, json) {
  return request('POST', path, userId, JSON.stringify(json))
}

module.exports = {
  get,
  post
}
