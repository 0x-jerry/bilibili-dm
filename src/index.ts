export * from './msg_model'
export * from './dm_client'
export * from './utils'

import { getRoomID, getRoomInfo, parseXml } from './utils'
import DMClient from './dm_client'

export async function connectToClient(chatID: number) {
  const roomID = await getRoomID(chatID)
  const roomInfo = await getRoomInfo(roomID)

  const xmlData = await parseXml(roomInfo)

  const hosts = xmlData.dm_host_list[0].split(',')
  const port = +xmlData.dm_port[0]
  const state = xmlData.state[0]

  console.log(hosts, port, state)

  return new DMClient(hosts[0], port, roomID)
}
