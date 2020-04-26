const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Challenge', async function() {
  let user1Id, user2Id, user3Id, player1Id, player2Id, player3Id

  before(async function() {
    user1Id = uuidv4()
    user2Id = uuidv4()
    user3Id = uuidv4()
    const { players } = await fixture.setState({
      rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
      players: ([room]) => [
        { as: user1Id, room_id: room.id, user_id: user1Id, nickname: 'user1' },
        { as: user2Id, room_id: room.id, user_id: user2Id, nickname: 'user2' },
        { as: user3Id, room_id: room.id, user_id: user3Id, nickname: 'user3' }
      ],
      turns: ([player1, player2, player3]) => [
        { as: user1Id, player_id: player1.id, card: 'red' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user3Id, player_id: player3.id, card: 'red' },
        { as: user1Id, player_id: player1.id, card: 'red' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user3Id, player_id: player3.id, card: 'red' },
        { as: user1Id, player_id: player1.id, bet: 6 }
      ]
    })
    player1Id = players[0].id
    player2Id = players[1].id
    player3Id = players[2].id
  })

  it('cannot fake player_id', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user2Id, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/invalid_player_id/)
  })

  it('cannot reveal if not challenger', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user2Id, {
      player_id: player2Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/player_not_challenger/)
  })

  it('cannot reveal other player cards before own', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/player_has_unrevealed_cards/)
  })

  it('can reveal first own card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal second own card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(200)
  })

  it('cannot reveal more own card', async function() {
    const { response, json } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player1Id
    })
    expect(response.status).to.equal(403)
    expect(json.message).to.match(/insufficient_privilege/)
    expect(json.details).to.match(/turn_not_found/)
  })

  it('can reveal second player first card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal third player first card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player3Id
    })
    expect(response.status).to.equal(200)
  })

  it('can reveal second player second card', async function() {
    const { response } = await fetch.post('/rpc/reveal_card', user1Id, {
      player_id: player1Id,
      target_player_id: player2Id
    })
    expect(response.status).to.equal(200)
  })
})
