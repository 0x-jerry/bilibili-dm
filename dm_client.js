const net = require('net')

class DMClient {
  constructor(host, port, roomID) {
    this.host = host
    this.port = port
    this.roomID = roomID

    this.client = new net.Socket()

    this.dataCache = Buffer.alloc(0)

    this.client.connect(
      {
        host: this.host,
        port: this.port,
      },
      () => this.joinRoom(),
    )

    this.client.on('data', (data) => this.receiveData(data))

    this.client.on('close', (err) => {
      console.log('Is closed by err:', err)
    })
  }

  receiveData(data) {
    let start = 0
    while (start !== false) {
      start = this.parseMsg(data, start)
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
      console.log('err', err)
    } else {
      this.heartBeat()
    }
  }

  sendSocketData(packetLength, magic, version, action, param = 1, body = '') {
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
    }, 3000)
  }

  /**
   *
   * @param {Buffer} data
   * @param {Number} start
   */
  parseMsg(data, start = 0) {
    if (this.dataCache.length > 16) {
      data = Buffer.concat([this.dataCache, data])
    }

    console.log('data length', data.length)

    if (data.length <= 16) {
      return false
    }

    if (start + 16 > data.length) {
      return false
    }

    const packetLength = data.readUInt32BE(start + 0) // 4
    const magic = data.readUInt16BE(start + 4) // 2
    const version = data.readUInt16BE(start + 6) // 2
    const typeId = data.readUInt32BE(start + 8) // 4
    const params = data.readUInt32BE(start + 12) // 4

    console.log(packetLength, magic, version, typeId, params)

    const msgData = data.toString('utf-8', start + 16, start + packetLength)

    if (start + packetLength > data.length) {
      this.dataCache = data.slice(start)
      console.log('Cache data:', msgData)
      return false
    } else {
      try {
        const msg = JSON.parse(msgData)
        console.log('Received:', JSON.stringify(msg, null, 2))
        if (this.dataCache.length > 0) {
          this.dataCache = Buffer.alloc(0)
          console.log('Clear Cache data')
        }
      } catch (error) {
        // console.log('Parse error', error);
      }
    }

    return start + packetLength
  }
}

module.exports = DMClient
