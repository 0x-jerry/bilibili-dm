import * as net from 'net'
import { EventEmitter } from 'events'

export enum DMEvent {
  live = 'live',
  preparing = 'preparing',
  online_changed = 'online_changed',
  error = 'error',
  close = 'close',
}

class DMClient extends EventEmitter {
  host: string
  port: number
  roomID: number
  client: net.Socket
  cacheData: Buffer

  constructor(host: string, port: number, roomID: number) {
    super()
    this.host = host
    this.port = port
    this.roomID = roomID

    this.client = new net.Socket()

    this.cacheData = Buffer.alloc(0)

    this.client.connect(
      {
        host: this.host,
        port: this.port,
      },
      () => this.joinRoom(),
    )

    this.client.on('data', (data) => this.receiveData(data))

    this.client.on('error', (err) => this.emit(DMEvent.error, err))

    this.client.on('close', (byError) => {
      this.emit(DMEvent.close, byError)
      console.log('Is closed by err:', byError)
    })
  }

  receiveData(data: Buffer) {
    let start: boolean | number = 0
    while (start !== false) {
      start = this.parseMsg(data, start as number)
    }
  }

  async joinRoom() {
    const joinData = JSON.stringify({
      roomid: this.roomID,
      uid: +Math.random()
        .toString(10)
        .substr(2, 10),
    })

    const err = await this.sendSocketData(0, 16, 1, 7, 1, joinData)

    if (err) {
      console.log('Join room error:', err)
      return Promise.reject(err)
    } else {
      this.heartBeat()
    }
  }

  sendSocketData(packetLength: number, magic: number, version: number, action: number, param = 1, body = '') {
    const payload = Buffer.from(body)

    if (packetLength === 0) {
      packetLength = payload.byteLength + 16
    }

    const buffer = Buffer.alloc(packetLength)

    buffer.writeUInt32BE(packetLength, 0) // 4
    buffer.writeUInt16BE(magic, 4) // 4 + 2
    buffer.writeUInt16BE(version, 6) // 6 + 2
    buffer.writeUInt32BE(action, 8) // 8 + 4
    buffer.writeUInt32BE(param, 12) // 12 + 4
    buffer.write(body, 16, 'utf-8') // 16 +

    return new Promise((resolve) => {
      this.client.write(buffer, (err) => resolve(err))
    })
  }

  heartBeat() {
    setInterval(() => {
      this.sendSocketData(0, 16, 1, 2, 1)
    }, 10000)
  }

  parseMsg(data: Buffer, start: number = 0) {
    if (data.length <= start + 16) {
      return false
    }

    if (this.cacheData.length > 0) {
      data = Buffer.concat([this.cacheData, data])
    }

    const packetLen = data.readUInt32BE(start + 0) // 4
    const magic = data.readUInt16BE(start + 4) // 2
    const version = data.readUInt16BE(start + 6) // 2
    const action = data.readUInt32BE(start + 8) // 4
    const params = data.readUInt32BE(start + 12) // 4

    console.log(packetLen, magic, version, action, params)

    if (action < 4) {
      const onlineCount = data.readUInt32BE(start + 16)
      this.emit(DMEvent.online_changed, onlineCount)
      return false
    } else if (action < 6) {
      const msgData = data.toString('utf-8', start + 16, start + packetLen)

      if (start + packetLen > data.length) {
        if (this.cacheData.length > 0) {
          console.log('Cache data error:', data.toString('utf-8', start))
          this.cacheData = Buffer.alloc(0)
        } else {
          this.cacheData = data.slice(start)
        }

        return false
      } else {
        try {
          const msg = JSON.parse(msgData)

          if (this.cacheData.length > 0) {
            this.cacheData = Buffer.alloc(0)
          }

          console.log('Received:', msg)
          this.emit(msg.cmd.toLowerCase(), msg)
        } catch (error) {
          console.log('Parse error', data)
        }
      }
    } else {
      return false
    }

    const nextStart = start + packetLen
    return nextStart === data.length ? false : nextStart
  }
}

export default DMClient
