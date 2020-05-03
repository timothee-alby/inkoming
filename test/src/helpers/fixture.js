const sequelize = require('./sequelize')
const fetch = require('./fetch')
var jwt = require('jsonwebtoken')

const postData = async function(path, data) {
  const postedJsons = []
  for (const datum of data) {
    postedJsons.push(await postDatum(path, datum))
  }
  return postedJsons
}

const postDatum = async function(path, datum) {
  const user = datum.as
  delete datum.as

  const { response, json } = await fetch.post(path, user, datum)

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Could not create fixture on ${path}! (${JSON.stringify(datum)})`
    )
  }

  return json
}

const generateUsers = async function(count) {
  const users = []
  while (count-- > 0) {
    const json = await postDatum('/rpc/generate_user', {})
    const payload = jwt.decode(json.jwt)
    users.push({ jwt: json.jwt, id: payload.user_id })
  }
  return users
}

const setState = async function({ users, rooms, players, turns, reveals }) {
  if (users) users = await generateUsers(users)

  if (typeof rooms === 'function') rooms = rooms(users)
  if (rooms) rooms = await postData('/rooms', rooms)

  if (typeof players === 'function') players = players(users, rooms)
  if (players) players = await postData('/players', players)

  if (typeof turns === 'function') turns = turns(users, players)
  if (turns) turns = await postData('/turns', turns)

  if (typeof reveals === 'function') reveals = reveals(users, players)
  if (reveals) reveals = await postData('/rpc/reveal_card', reveals)

  return { users, rooms, players, turns, reveals }
}

const clearState = async function() {
  return sequelize.query('DELETE FROM api.rooms')
}

module.exports = {
  clearState,
  setState
}
