export * from './msg_model'
export * from './dm_client'
export * from './api'

import { getRoomID, getLiveConf } from './api'
import DMClient from './dm_client'

export async function connectToClient(chatID: number) {
  const liveInfo = await getRoomID(chatID)

  const liveConf = await getLiveConf(liveInfo.roomId)

  console.log(liveConf.host, liveConf.port, liveInfo.status)
  return new DMClient(liveConf.host, liveConf.port, liveInfo.roomId)
}
