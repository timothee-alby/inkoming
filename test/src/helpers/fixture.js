const sequelize = require('./sequelize')
const fetch = require('./fetch')

const postData = async function(path, data) {
  const postedJsons = []
  for (const datum of data) {
    postedJsons.push(await postDatum(path, datum))
  }
  return postedJsons
}

const postDatum = async function(path, datum) {
  const userId = datum.as
  delete datum.as
  const { response, json } = await fetch.post(path, userId, datum)
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Could not create fixture on ${path}! (${JSON.stringify(datum)})`
    )
  }
  return json
}

const setState = async function({ rooms, players, turns, reveals }) {
  if (rooms) rooms = await postData('/rooms', rooms)

  if (typeof players === 'function') players = players(rooms)
  if (players) players = await postData('/players', players)

  if (typeof turns === 'function') turns = turns(players)
  if (turns) turns = await postData('/turns', turns)

  if (typeof reveals === 'function') reveals = reveals(players)
  if (reveals) reveals = await postData('/rpc/reveal_card', reveals)

  return { rooms, players, turns, reveals }
}

const clearState = async function() {
  return sequelize.query('DELETE FROM api.rooms')
}

module.exports = {
  clearState,
  setState
}
