const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Turns', async function() {
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
      ]
    })
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('can add turns', async function() {
    const { response } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      card: 'black'
    })
    expect(response.status).to.equal(201)
  })

  it('cannot add turns for other players', async function() {
    const { response, json } = await fetch.post('/turns', user1Id, {
      player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "turns"'
    )
  })

  it('cannot add turns with invalid cards', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      card: 'blue'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/invalid input value for enum card/)
  })

  it('cannot add turns without card, bet or fold', async function() {
    const { response, json } = await fetch.post('/turns', user2Id, {
      player_id: player2Id
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/turns_only_card_or_bet_or_fold/)
  })

  it('cannot add turns out of order', async function() {
    const { response, json } = await fetch.post('/turns', user1Id, {
      player_id: player1Id,
      card: 'red'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_order/)
    expect(json.details).to.match(/player_not_in_order/)
  })
})
