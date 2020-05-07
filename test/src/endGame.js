const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('End Game', async function() {
  describe('Elimination', async function() {
    let roomId, user1, player1, player2
    beforeEach(async function() {
      const { users, rooms, players } = await fixture.setState({
        users: 3,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1, user2, user3], [room1]) => [
          { as: user1, room_id: room1.id, user_id: user1.id, nickname: 'u1' },
          { as: user2, room_id: room1.id, user_id: user2.id, nickname: 'u2' },
          { as: user3, room_id: room1.id, user_id: user3.id, nickname: 'u3' }
        ]
      })

      roomId = rooms[0].id
      user1 = users[0]
      player1 = players[0]
      player2 = players[1]
    })

    it('dead player is not next anymore', async function() {
      await fixture.setPlayerCards(player1.id, [])

      const { json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.next_player_id).to.equal(player2.id)
    })
  })
})
