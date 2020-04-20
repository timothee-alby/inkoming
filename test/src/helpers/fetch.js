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

async function request(method, path, headers, userId, body) {
  headers = Object.assign(
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${makeJwt(userId)}`
    },
    headers
  )

  const response = await fetch(`${process.env.PGRST_API_URL}${path}`, {
    method,
    headers,
    body
  })

  return { response, json: response.json ? await response.json() : null }
}

async function get(path, userId) {
  return request('GET', path, {}, userId)
}

async function post(path, userId, json) {
  return request(
    'POST',
    path,
    {
      Accept: 'application/vnd.pgrst.object+json',
      Prefer: 'return=representation'
    },
    userId,
    JSON.stringify(json)
  )
}

module.exports = {
  get,
  post
}
