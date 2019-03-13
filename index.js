const axios = require('axios').default
const xml2js = require('xml2js')
const DMClient = require('./dm_client')

const hosts = {
  async getRoomInfo(roomID) {
    const url = 'http://live.bilibili.com/api/player?id=cid:' + roomID
    const res = await axios.get(url)

    return res.data
  },
  async getRoomID(chatID) {
    const url =
      'http://api.live.bilibili.com/room/v1/Room/room_init?id=' + chatID
    const res = await axios.get(url)

    return res.data
  },
}

const DMConnectionInfo = {
  connected: false,
  hosts: [],
  port: 0,
}

const RoomInfo = {
  id: 0,
  state: '',
}

hosts
  .getRoomID(281)
  .then((data) => {
    RoomInfo.id = +data.data.room_id
    return hosts.getRoomInfo(RoomInfo.id)
  })
  .then((data) => {
    data = `<root>${data}</root>`

    xml2js.parseString(data, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      DMConnectionInfo.hosts = data.root.dm_host_list[0].split(',')
      DMConnectionInfo.port = +data.root.dm_port[0]
      RoomInfo.state = data.root.state[0]
      console.log(DMConnectionInfo, RoomInfo)

      new DMClient(
        DMConnectionInfo.hosts[0],
        DMConnectionInfo.port,
        RoomInfo.id,
      )
    })
  })
