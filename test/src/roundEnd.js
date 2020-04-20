const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Round end', async function() {
  let roomId, user1Id, user2Id, player2Id, player1Id

  beforeEach(async function() {
    user1Id = uuidv4()
    user2Id = uuidv4()
    const { rooms, players } = await fixture.setState({
      rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
      players: ([room]) => [
        { as: user1Id, room_id: room.id, user_id: user1Id },
        { as: user2Id, room_id: room.id, user_id: user2Id }
      ],
      turns: ([player1, player2]) => [
        { as: user1Id, player_id: player1.id, card: 'black' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user1Id, player_id: player1.id, card: 'red' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user1Id, player_id: player1.id, bet: 1 }
      ]
    })
    roomId = rooms[0].id
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('last standing player cannot play anymore', async function() {
    await fixture.setState({
      turns: [{ as: user2Id, player_id: player2Id, fold: true }]
    })

    const { response, json } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      fold: true
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_fold/)
    expect(json.details).to.match(/turn_cannot_fold/)
  })

  it('last standing player is challenger', async function() {
    await fixture.setState({
      turns: [{ as: user2Id, player_id: player2Id, fold: true }]
    })

    const { json } = await fetch.get(
      `/room_states?room_id=eq.${roomId}`,
      user2Id,
      {
        player_id: player2Id,
        bet: 4
      }
    )
    const [roomState] = json
    expect(roomState.challenger_player_id).to.equal(player1Id)
  })

  it('betting max bet ends the game', async function() {
    const { response } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      bet: 4
    })
    expect(response.status).to.equal(201)

    const { json } = await fetch.get(
      `/room_states?room_id=eq.${roomId}`,
      user2Id,
      {
        player_id: player2Id,
        bet: 4
      }
    )
    const [roomState] = json
    expect(roomState.challenger_player_id).to.equal(player2Id)
  })
})
