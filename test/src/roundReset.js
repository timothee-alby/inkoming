const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

let roomId, user1, user2, user3, player1Id, player2Id, player3Id

const setPendingState = async function() {
  const { users, rooms, players } = await fixture.setState({
    users: 3,
    rooms: ([user1, user2, user3]) => [
      { as: user1, user_id: user1.id, name: 'Foo Name' },
      { as: user3, user_id: user3.id, name: 'Bar Name' }
    ],
    players: ([user1, user2, user3], [room1, room2]) => [
      { as: user1, room_id: room1.id, user_id: user1.id, nickname: 'user1' },
      { as: user2, room_id: room1.id, user_id: user2.id, nickname: 'user2' },
      { as: user3, room_id: room1.id, user_id: user3.id, nickname: 'user3' }
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
  user3 = users[2]
  player1Id = players[0].id
  player2Id = players[1].id
  player3Id = players[2].id
}

describe('Round Reset', async function() {
  describe('On Won', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal second red card
          { as: user1, player_id: player1Id, target_player_id: player2Id }
        ]
      })
    })

    it('users cannot fake their player_id', async function() {
      const { response, json } = await fetch.post('/rpc/reset_round', user3, {
        player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('invalid_player_id')
    })

    it('add one point to challenger', async function() {
      const { response } = await fetch.post('/rpc/reset_round', user2, {
        player_id: player2Id
      })
      expect(response.status).to.equal(200)

      const { json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      const { all_players: allPlayers } = roomState
      const [player1State, player2State, player3State] = allPlayers
      expect(player1State.points).to.equal(1)
      expect(player2State.points).to.equal(0)
      expect(player3State.points).to.equal(0)

      expect(roomState.next_player_id).to.equal(player1Id)
    })
  })

  describe('On Lost', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal black card
          { as: user1, player_id: player1Id, target_player_id: player3Id }
        ]
      })
    })

    it('remove one card from challenger', async function() {
      const { response } = await fetch.post('/rpc/reset_round', user2, {
        player_id: player2Id
      })
      expect(response.status).to.equal(200)

      const { json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      const [{ room_states: roomStates }] = json
      const [{ all_players: allPlayers }] = roomStates
      const [player1State, player2State, player3State] = allPlayers
      expect(player1State.total_cards).to.equal(3)
      expect(player2State.total_cards).to.equal(4)
      expect(player3State.total_cards).to.equal(4)

      expect(player1State.points).to.equal(0)
      expect(player2State.points).to.equal(0)
      expect(player3State.points).to.equal(0)
    })
  })
})
