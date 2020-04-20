const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Bets', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let player1Id
  let player2Id

  before(async function() {
    const { players } = await fixture.setState({
      rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
      players: ([room]) => [
        { as: user1Id, room_id: room.id, user_id: user1Id },
        { as: user2Id, room_id: room.id, user_id: user2Id }
      ],
      turns: ([player1, player2]) => [
        { as: user1Id, player_id: player1.id, card: 'black' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user1Id, player_id: player1.id, card: 'red' },
        { as: user2Id, player_id: player2.id, card: 'red' }
      ]
    })
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('cannot bet 0', async function() {
    const { response, json } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      bet: 0
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_low/)
  })

  it('can bet once all players have played', async function() {
    const { response } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      bet: 1
    })
    expect(response.status).to.equal(201)
  })

  it('cannot card once a players has bet', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      card: 'red'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_card/)
    expect(json.details).to.match(/turn_cannot_card/)
  })

  it('cannot bet lower or equal to min bet', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      bet: 1
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_low/)
  })

  it('cannot bet higher than max bet', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      bet: 9
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/bet_too_high/)
  })
})
