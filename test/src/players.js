const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Players', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let roomId

  before(async function() {
    await fixture.clearState()
    const { rooms } = await fixture.setState({
      rooms: [{ name: 'Foo Name' }]
    })
    roomId = rooms[0].id
  })

  it('cannot join without room id', async function() {
    const { response, json } = await fetch.post('/players', user1Id, {
      room_id: '9d89f9f7-2caf-40b9-bb99-112bc4170dfb',
      user_id: user1Id
    })
    expect(response.status).to.equal(409)
    expect(json.message).to.match(/players_room_id_fkey/)
  })

  it('cannot join without user id', async function() {
    const { response, json } = await fetch.post('/players', user1Id, {
      room_id: roomId
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "players"'
    )
  })

  it('player 1 can join', async function() {
    const { response } = await fetch.post('/players', user1Id, {
      room_id: roomId,
      user_id: user1Id
    })
    expect(response.status).to.equal(201)
  })

  it('player 2 can join', async function() {
    const { response } = await fetch.post('/players', user2Id, {
      room_id: roomId,
      user_id: user2Id
    })
    expect(response.status).to.equal(201)
  })

  it('cannot fake their user id', async function() {
    const { response, json } = await fetch.post('/players', user1Id, {
      room_id: roomId,
      user_id: user2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "players"'
    )
  })

  it('cannot join a room twice', async function() {
    const { response, json } = await fetch.post('/players', user1Id, {
      room_id: roomId,
      user_id: user1Id
    })
    expect(response.status).to.equal(409)
    expect(json.message).to.match(/players_room_id_user_id_key/)
  })

  it('can only list themselves', async function() {
    let result = await fetch.get('/players', user1Id)
    expect(result.json).to.be.ofSize(1)

    result = await fetch.get('/players', user2Id)
    expect(result.json).to.be.ofSize(1)
  })
})
