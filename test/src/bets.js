const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Bets', async function() {
  let user1, user2, player1Id, player2Id

  before(async function() {
    const { users, players } = await fixture.setState({
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
        { as: user2, player_id: player2.id, card: 'red' }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('cannot bet 0', async function() {
    const { response, json } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      bet: 0
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_low/)
  })

  it('can bet once all players have played', async function() {
    const { response } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      bet: 1
    })
    expect(response.status).to.equal(201)
  })

  it('cannot card once a players has bet', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      card: 'red'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_card/)
    expect(json.details).to.match(/turn_cannot_card/)
  })

  it('cannot bet lower or equal to min bet', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      bet: 1
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_low/)
  })

  it('cannot bet higher than max bet', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      bet: 9
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_high/)
  })
})
