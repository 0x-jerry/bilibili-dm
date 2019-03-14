import * as utils from './utils'
import DMClient from './dm_client'

const DMConnectionInfo = {
  connected: false,
  hosts: [],
  port: 0,
}

const RoomInfo = {
  id: 0,
  state: '',
}

async function start(chatID: number) {
  const roomID = await utils.getRoomID(chatID)
  const roomInfo = await utils.getRoomInfo(roomID)

  const xmlData = await utils.parseXml(roomInfo)

  DMConnectionInfo.hosts = xmlData.dm_host_list[0].split(',')
  DMConnectionInfo.port = +xmlData.dm_port[0]
  RoomInfo.state = xmlData.state[0]
  console.log(DMConnectionInfo, RoomInfo)

  new DMClient(DMConnectionInfo.hosts[0], DMConnectionInfo.port, RoomInfo.id)
}

start(281)
