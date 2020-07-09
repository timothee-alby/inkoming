import OError from '@overleaf/o-error'

class SocketHelper {
  constructor(
    playerJwt,
    playerId,
    setSocketIsConnected,
    setNotifications,
    setRoomState,
    setIsDirty,
    setError
  ) {
    this.socket = null
    this.playerJwt = playerJwt
    this.playerId = playerId
    this.setSocketIsConnected = setSocketIsConnected
    this.setNotifications = setNotifications
    this.setRoomState = setRoomState
    this.setIsDirty = setIsDirty
    this.setError = setError
    this.isConnected = false
    this.retryCount = 0
  }

  onOpen(e) {
    this.setSocketIsConnected(true)
    this.isConnected = true
    this.retryCount = 0
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

    if (payload.room_state_changed) {
      this.setIsDirty(true)
      return
    }

    this.pushNotification(payload)
  }

  onClose(e) {
    this.pushNotification({
      key: this.isConnected
        ? 'notification.network.disconnected'
        : 'notification.network.unreachable',
      noHide: true
    })
    this.isConnected = false
    this.setSocketIsConnected(false)
    window.setTimeout(() => {
      this.reconnect()
    }, 1000 + this.retryCount * 3000)
  }

  reconnect() {
    if (this.isConnected) return
    if (this.retryCount > 5) {
      this.pushNotification({
        key: 'notification.network.abandon',
        noHide: true
      })

      this.setError(
        new OError('socket down', {
          clientKey: 'socket_down',
          retryable: true
        })
      )
      return
    }
    this.retryCount++
    this.socket.close()
    this.socket = null
    this.createSocket()
  }

  createSocket() {
    if (this.socket) return this.socket

    this.pushNotification({
      key: 'notification.network.connecting',
      noHide: true
    })

    this.socket = new WebSocket(
      `${process.env.WEBSOCKET_URL}/${this.playerJwt}`
    )

    this.socket.onclose = e => this.onClose(e)

    this.socket.onopen = e => this.onOpen(e)

    this.socket.onmessage = e => this.onMessage(e)
  }

  pushNotification(payload) {
    if (payload.source_player_id === this.playerId) {
      return
    }
    this.setNotifications(prev => {
      return [...prev, { payload, timestamp: new Date().getTime() }]
    })
  }
}

export default SocketHelper
