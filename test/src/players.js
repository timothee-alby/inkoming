const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Players', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let roomId

  before(async function() {
    const { rooms } = await fixture.setState({
      rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }]
    })
    roomId = rooms[0].id
  })

  it('cannot join without room id', async function() {
    const { response, json } = await fetch.post('/players', user1Id, {
      room_id: '9d89f9f7-2caf-40b9-bb99-112bc4170dfb',
      user_id: user1Id,
      nickname: 'foo'
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
      user_id: user1Id,
      nickname: 'My sweet nickname'
    })
    expect(response.status).to.equal(201)
  })

  it('player 2 can join', async function() {
    const { response } = await fetch.post('/players', user2Id, {
      room_id: roomId,
      user_id: user2Id,
      nickname: 'My better nickname'
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
      user_id: user1Id,
      nickname: 'bar'
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

  describe('Connect', async function() {
    let player1
    let player2

    before(async function() {
      const { players } = await fixture.setState({
        rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
        players: ([room]) => [
          {
            as: user1Id,
            room_id: room.id,
            user_id: user1Id,
            nickname: 'user1'
          },
          { as: user2Id, room_id: room.id, user_id: user2Id, nickname: 'user2' }
        ]
      })
      player1 = players[0]
      player2 = players[1]
    })

    it('can connect', async function() {
      const { response, json } = await fetch.post(
        '/rpc/connect_player',
        user1Id,
        {
          player_id: player1.id
        }
      )
      expect(response.status).to.equal(200)
      expect(json.jwt).to.exist
    })

    it('cannot join for another player', async function() {
      const { response, json } = await fetch.post(
        '/rpc/connect_player',
        user1Id,
        {
          player_id: player2.id
        }
      )
      expect(response.status).to.equal(403)
      expect(json.details).to.equal('invalid_player_id')
    })
  })
})
