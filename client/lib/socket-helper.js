class SocketHelper {
  constructor(playerJwt, setSocketIsConnected, setNotifications, setRoomState) {
    this.socket = null
    this.playerJwt = playerJwt
    this.setSocketIsConnected = setSocketIsConnected
    this.setNotifications = setNotifications
    this.setRoomState = setRoomState
  }

  onOpen(e) {
    this.setSocketIsConnected(true)
    this.pushNotification({ key: 'notification.network.connected' })
  }

  onMessage(e) {
    const data = JSON.parse(e.data)
    const payload = data.payload
    if (!payload) return

    if (payload.room_state) {
      this.setRoomState(payload.room_state)
      return
    }

    this.pushNotification(payload)
  }

  createSocket() {
    if (this.socket) return this.socket

    this.pushNotification({ key: 'notification.network.connecting' })

    this.socket = new WebSocket(
      `${process.env.WEBSOCKET_URL}/${this.playerJwt}`
    )

    this.socket.onopen = e => this.onOpen(e)

    this.socket.onmessage = e => this.onMessage(e)
  }

  pushNotification(payload) {
    this.setNotifications(prev => {
      return [...prev, { payload, timestamp: new Date().getTime() }]
    })
  }
}

export default SocketHelper
