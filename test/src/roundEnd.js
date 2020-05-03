const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Round end', async function() {
  let roomId, user1, user2, player2Id, player1Id

  beforeEach(async function() {
    const { users, rooms, players } = await fixture.setState({
      users: 2,
      rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }],
      players: ([user1, user2], [room]) => [
        { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
      ],
      turns: ([user1, user2], [player1, player2]) => [
        { as: user1, player_id: player1.id, card: 'black' },
        { as: user2, player_id: player2.id, card: 'red' },
        { as: user1, player_id: player1.id, card: 'red' },
        { as: user2, player_id: player2.id, card: 'red' },
        { as: user1, player_id: player1.id, bet: 1 }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    roomId = rooms[0].id
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('last standing player cannot play anymore', async function() {
    await fixture.setState({
      turns: [{ as: user2, player_id: player2Id, fold: true }]
    })

    const { response, json } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      fold: true
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_fold/)
    expect(json.details).to.match(/turn_cannot_fold/)
  })

  it('last standing player is challenger', async function() {
    await fixture.setState({
      turns: [{ as: user2, player_id: player2Id, fold: true }]
    })

    const { json } = await fetch.get(
      `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
      user2
    )
    const [{ room_states: roomStates }] = json
    const [roomState] = roomStates
    expect(roomState.challenger_player_id).to.equal(player1Id)
  })

  it('betting max bet ends the game', async function() {
    const { response } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      bet: 4
    })
    expect(response.status).to.equal(201)

    const { json } = await fetch.get(
      `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
      user2,
      {
        player_id: player2Id,
        bet: 4
      }
    )
    const [{ room_states: roomStates }] = json
    const [roomState] = roomStates
    expect(roomState.challenger_player_id).to.equal(player2Id)
  })
})
