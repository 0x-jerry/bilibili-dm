export * from './msg_model'
export * from './dm_client'
export * from './api'

import { getRoomInfo, getLiveConf } from './api'
import DMClient from './dm_client'

export async function connectToClient(chatID: number) {
  const roomInfo = await getRoomInfo(chatID)

  const liveConf = await getLiveConf(roomInfo.roomID)

  console.log(liveConf.host, liveConf.port, roomInfo.status)
  return new DMClient(liveConf.host, liveConf.port, roomInfo.roomID)
}
