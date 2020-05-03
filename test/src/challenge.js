const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Challenge', async function() {
  let user1, user2, player1Id, player2Id, player3Id

  before(async function() {
    const { users, players } = await fixture.setState({
      users: 3,
      rooms: ([user1]) => [
        { as: user1, user_id: user1.id, name: 'Foo Name' }
      ],
      players: ([user1, user2, user3], [room]) => [
        { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' },
        { as: user3, room_id: room.id, user_id: user3.id, nickname: 'user3' }
      ],
      turns: ([user1, user2, user3], [player1, player2, player3]) => [
        { as: user1, player_id: player1.id, card: 'red' },
        { as: user2, player_id: player2.id, card: 'red' },
        { as: user3, player_id: player3.id, card: 'red' },
        { as: user1, player_id: player1.id, card: 'red' },
        { as: user2, player_id: player2.id, card: 'red' },
        { as: user3, player_id: player3.id, card: 'red' },
        { as: user1, player_id: player1.id, bet: 6 }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    player1Id = players[0].id
    player2Id = players[1].id
    player3Id = players[2].id
  })

  it('cannot fake player_id', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user2, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/invalid_player_id/)
  })

  it('cannot reveal if not challenger', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user2, {
      player_id: player2Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/player_not_challenger/)
  })

  it('cannot reveal other player cards before own', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/player_has_unrevealed_cards/)
  })

  it('can reveal first own card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal second own card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(200)
  })

  it('cannot reveal more own card', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/turn_not_found/)
  })

  it('can reveal second player first card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal third player first card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player3Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal second player second card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(200)
  })
})
