const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

let roomId, user1, user2, player1Id, player2Id, player3Id
const setPendingState = async function() {
  const { users, rooms, players } = await fixture.setState({
    users: 3,
    rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }],
    players: ([user1, user2, user3], [room]) => [
      { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
      { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' },
      { as: user3, room_id: room.id, user_id: user3.id, nickname: 'user3' }
    ],
    turns: ([user1, user2, user3], [player1, player2, player3]) => [
      { as: user1, player_id: player1.id, card: 'red' },
      { as: user2, player_id: player2.id, card: 'red' },
      { as: user3, player_id: player3.id, card: 'black' },
      { as: user1, player_id: player1.id, bet: 2 },
      { as: user2, player_id: player2.id, fold: true },
      { as: user3, player_id: player3.id, fold: true }
    ],
    reveals: ([user1], [player1]) => [
      { as: user1, player_id: player1.id, target_player_id: player1.id }
    ]
  })
  roomId = rooms[0].id
  user1 = users[0]
  user2 = users[1]
  player1Id = players[0].id
  player2Id = players[1].id
  player3Id = players[2].id
}

describe('Round Outcome', async function() {
  describe('Winning', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal second red card
          { as: user1, player_id: player1Id, target_player_id: player2Id }
        ]
      })
    })

    it('cannot reveal anymore', async function() {
      const { response, json } = await fetch.post('/rpc/reveal_card', user1, {
        player_id: player1Id,
        target_player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('round_has_outcome')
    })

    it('has won outcome', async function() {
      const { json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user2
      )
      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.challenger_player_id).to.equal(player1Id)
      expect(roomState.total_revealed_cards).to.equal(2)
      expect(roomState.total_revealed_red_cards).to.equal(2)
      expect(roomState.total_revealed_black_cards).to.equal(0)
      expect(roomState.outcome).to.equal('won')
    })
  })

  describe('Losing', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal black card
          { as: user1, player_id: player1Id, target_player_id: player3Id }
        ]
      })
    })

    it('cannot reveal anymore', async function() {
      const { response, json } = await fetch.post('/rpc/reveal_card', user1, {
        player_id: player1Id,
        target_player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('round_has_outcome')
    })

    it('has lost outcome', async function() {
      const { json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user2
      )
      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.challenger_player_id).to.equal(player1Id)
      expect(roomState.total_revealed_cards).to.equal(2)
      expect(roomState.total_revealed_red_cards).to.equal(1)
      expect(roomState.total_revealed_black_cards).to.equal(1)
      expect(roomState.outcome).to.equal('lost')
    })
  })
})
