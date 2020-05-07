const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Players', async function() {
  let user1, user2, user3, player1, roomId

  before(async function() {
    const { users, rooms } = await fixture.setState({
      users: 3,
      rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }]
    })
    user1 = users[0]
    user2 = users[1]
    user3 = users[2]
    roomId = rooms[0].id
  })

  it('cannot join without room id', async function() {
    const { response, json } = await fetch.post('/players', user1, {
      room_id: '9d89f9f7-2caf-40b9-bb99-112bc4170dfb',
      user_id: user1.id,
      nickname: 'foo'
    })
    expect(response.status).to.equal(409)
    expect(json.message).to.match(/players_room_id_fkey/)
  })

  it('cannot join without user id', async function() {
    const { response, json } = await fetch.post('/players', user1, {
      room_id: roomId
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "players"'
    )
  })

  it('player 1 can join', async function() {
    const { response, json } = await fetch.post('/players', user1, {
      room_id: roomId,
      user_id: user1.id,
      nickname: 'My sweet nickname'
    })
    expect(response.status).to.equal(201)
    player1 = json
  })

  it('player 2 can join', async function() {
    const { response } = await fetch.post('/players', user2, {
      room_id: roomId,
      user_id: user2.id,
      nickname: 'My better nickname'
    })
    expect(response.status).to.equal(201)
  })

  it('cannot fake their user id', async function() {
    const { response, json } = await fetch.post('/players', user1, {
      room_id: roomId,
      user_id: user2.id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "players"'
    )
  })

  it('cannot join a room twice', async function() {
    const { response, json } = await fetch.post('/players', user1, {
      room_id: roomId,
      user_id: user1.id,
      nickname: 'bar'
    })
    expect(response.status).to.equal(409)
    expect(json.message).to.match(/players_room_id_user_id_key/)
  })

  it('can only list themselves', async function() {
    let result = await fetch.get('/players', user1)
    expect(result.json).to.be.ofSize(1)

    result = await fetch.get('/players', user2)
    expect(result.json).to.be.ofSize(1)
  })

  describe('Connect', async function() {
    let player1
    let player2

    before(async function() {
      const { users, players } = await fixture.setState({
        users: 2,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1], [room]) => [
          {
            as: user1,
            room_id: room.id,
            user_id: user1.id,
            nickname: 'user1'
          },
          { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
        ]
      })
      user1 = users[0]
      user2 = users[1]
      player1 = players[0]
      player2 = players[1]
    })

    it('can connect', async function() {
      const { response, json } = await fetch.post(
        '/rpc/connect_player',
        user1,
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
        user1,
        {
          player_id: player2.id
        }
      )
      expect(response.status).to.equal(403)
      expect(json.details).to.equal('invalid_player_id')
    })
  })

  it('cannot join when round has started', async function() {
    await fetch.post('/turns', user1, {
      player_id: player1.id,
      card: 'black'
    })
    const { response, json } = await fetch.post('/players', user3, {
      room_id: roomId,
      user_id: user3.id,
      nickname: 'nickname'
    })
    expect(response.status).to.equal(400)
    expect(json.details).to.equal('round_has_started')
  })
})
