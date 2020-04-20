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
  const { json } = await fetch.post(path, userId, datum)
  return json
}

const setState = async function({ rooms, players, turns }) {
  if (rooms) rooms = await postData('/rooms', rooms)

  if (typeof players === 'function') players = players(rooms)
  if (players) players = await postData('/players', players)

  if (typeof turns === 'function') turns = turns(players)
  if (turns) turns = await postData('/turns', turns)

  return { rooms, players, turns }
}

const clearState = async function() {
  return sequelize.query('DELETE FROM api.rooms')
}

module.exports = {
  clearState,
  setState
}
