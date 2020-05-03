class SocketHelper {
  constructor(playerJwt, setSocketIsConnected, setNotification, setRoomState) {
    this.socket = null
    this.playerJwt = playerJwt
    this.setSocketIsConnected = setSocketIsConnected
    this.setNotification = setNotification
    this.setRoomState = setRoomState
  }

  onOpen(e) {
    this.socket.send(
      JSON.stringify({
        type: 'NOTIFICATION',
        data: { text: 'A player joined', timestamp: Date.now() }
      })
    )
    this.setSocketIsConnected(true)
    this.setNotification({
      text: 'Connected'
    })
  }

  onMessage(e) {
    const data = JSON.parse(e.data)
    const payload = data.payload
    if (!payload) return

    switch (payload.type) {
      case 'NOTIFICATION':
        this.setNotification(payload.data)
        break
      case 'STATE':
        this.setRoomState(payload.data)
        break
    }
  }

  createSocket() {
    if (this.socket) return this.socket

    this.setNotification({
      text: 'Connecting...'
    })

    this.socket = new WebSocket(
      `${process.env.WEBSOCKET_URL}/${this.playerJwt}`
    )

    this.socket.onopen = e => this.onOpen(e)

    this.socket.onmessage = e => this.onMessage(e)
  }
}

export default SocketHelper
