const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Leave', async function() {
  let user1, user2, player2Id, player3Id, player4Id

  before(async function() {
    const { users, players } = await fixture.setState({
      users: 2,
      rooms: ([user1, user2]) => [
        { as: user1, user_id: user1.id, name: 'Foo Name' },
        { as: user2, user_id: user2.id, name: 'Bar Name' }
      ],
      players: ([user1, user2], [room1, room2]) => [
        { as: user1, room_id: room1.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room1.id, user_id: user2.id, nickname: 'user2' },
        { as: user1, room_id: room2.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room2.id, user_id: user2.id, nickname: 'user2' }
      ],
      turns: ([user1], [player1]) => [
        { as: user1, player_id: player1.id, card: 'black' }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    player2Id = players[1].id
    player3Id = players[2].id
    player4Id = players[3].id
  })

  it('prevent owner from leaving', async function() {
    const { response, json } = await fetch.del(
      `/players?id=eq.${player4Id}`,
      user2
    )
    expect(response.status).to.equal(400)
    expect(json.message).to.equal('api_players_validate_leave')
    expect(json.details).to.equal('room_creator_cannot_leave')

    const playersGetRequest = await fetch.get(`/players`, user2)
    expect(playersGetRequest.json.length).to.equal(2)
  })

  it('cannot delete other players', async function() {
    const { response } = await fetch.del(`/players?id=eq.${player3Id}`, user2)
    expect(response.status).to.equal(204)

    const playersGetRequest = await fetch.get(`/players`, user1)
    expect(playersGetRequest.json.length).to.equal(2)
  })

  it('deletes player', async function() {
    const { response } = await fetch.del(`/players?id=eq.${player3Id}`, user1)
    expect(response.status).to.equal(204)

    const playersGetRequest = await fetch.get(`/players`, user1)
    expect(playersGetRequest.json.length).to.equal(1)
  })

  it('prevent leave when room has turns', async function() {
    const { response, json } = await fetch.del(
      `/players?id=eq.${player2Id}`,
      user2
    )
    expect(response.status).to.equal(400)
    expect(json.message).to.equal('api_players_validate_leave')
    expect(json.details).to.equal('round_has_started')

    const playersGetRequest = await fetch.get(`/players`, user2)
    expect(playersGetRequest.json.length).to.equal(2)
  })
})
