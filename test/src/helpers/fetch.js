const fetch = require('node-fetch')

async function request(method, path, headers, user, body) {
  headers = Object.assign(
    {
      'Content-Type': 'application/json'
    },
    headers
  )

  if (user) {
    headers.Authorization = `Bearer ${user.jwt}`
  }

  const response = await fetch(`${process.env.PGRST_API_URL}${path}`, {
    method,
    headers,
    body
  })

  if (response.status === 204) {
    return { response }
  }
  return { response, json: response.json ? await response.json() : null }
}

async function get(path, user) {
  return request('GET', path, {}, user)
}

async function post(path, user, json) {
  return request(
    'POST',
    path,
    {
      Accept: 'application/vnd.pgrst.object+json',
      Prefer: 'return=representation'
    },
    user,
    JSON.stringify(json)
  )
}

async function del(path, user) {
  return request('DELETE', path, {}, user)
}

module.exports = {
  get,
  post,
  del
}
