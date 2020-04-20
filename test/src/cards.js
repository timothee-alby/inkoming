const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Cards', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let player1Id
  let player2Id

  before(async function() {
    await fixture.clearState()
    const { players } = await fixture.setState({
      rooms: [{ as: user1Id, name: 'Foo Name' }],
      players: ([room]) => [
        { as: user1Id, room_id: room.id, user_id: user1Id },
        { as: user2Id, room_id: room.id, user_id: user2Id }
      ],
      turns: ([player1]) => [
        { as: user1Id, player_id: player1.id, card: 'black' }
      ]
    })
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('cannot add bet until all players have played', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      bet: 1
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/turn_cannot_bet/)
  })

  it('cannot fold until all players have played', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      fold: true
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_fold/)
    expect(json.details).to.match(/turn_cannot_fold/)
  })

  it('can play red', async function() {
    const { response } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      card: 'red'
    })
    expect(response.status).to.equal(201)
  })

  it('removes played card from player 1', async function() {
    const { json } = await fetch.get('/players', user1Id)
    expect(json).to.be.ofSize(1)
    const [player] = json
    expect(player.cards).to.be.equalTo(['red', 'red', 'red'])
  })

  it('removes played card from player 2', async function() {
    const { json } = await fetch.get('/players', user2Id)
    expect(json).to.be.ofSize(1)
    const [player] = json
    expect(player.cards).to.be.equalTo(['black', 'red', 'red'])
  })

  it('cannot play black twice', async function() {
    const { response, json } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      card: 'black'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_card/)
    expect(json.details).to.match(/player_does_not_have_card/)
  })

  it('can play red twice', async function() {
    const { response } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      card: 'red'
    })
    expect(response.status).to.equal(201)
  })

  it('removes second played card from player 1', async function() {
    const { json } = await fetch.get('/players', user1Id)
    expect(json).to.be.ofSize(1)
    const [player] = json
    expect(player.cards).to.be.equalTo(['red', 'red'])
  })
})
