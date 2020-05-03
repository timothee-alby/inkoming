const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Turns', async function() {
  let user1, user2, player1Id, player2Id

  before(async function() {
    const { users, players } = await fixture.setState({
      users: 2,
      rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }],
      players: ([user1, user2], [room]) => [
        { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('can add turns', async function() {
    const { response } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      card: 'black'
    })
    expect(response.status).to.equal(201)
  })

  it('cannot add turns for other players', async function() {
    const { response, json } = await fetch.post('/turns', user1, {
      player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.equal(
      'new row violates row-level security policy for table "turns"'
    )
  })

  it('cannot add turns with invalid cards', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      card: 'blue'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/invalid input value for enum card/)
  })

  it('cannot add turns without card, bet or fold', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/turns_only_card_or_bet_or_fold/)
  })

  it('cannot add turns out of order', async function() {
    const { response, json } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      card: 'red'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_order/)
    expect(json.details).to.match(/player_not_in_order/)
  })
})
