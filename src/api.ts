import axios from 'axios'

const apiRoot = 'https://api.live.bilibili.com'

export interface IServerConf {
  host: string
  port: number
  ws_port: number
  wss_port: number
}

export async function getLiveConf(roomID: number) {
  const url = apiRoot + '/room/v1/Danmu/getConf?room_id=' + roomID
  const res = await axios.get(url)
  const data = res.data.data

  return {
    host: data.host,
    port: data.port,
    servers: data.host_server_list as IServerConf[],
    token: data.token as string
  }
}

export async function getRoomID(chatID: number) {
  const url = apiRoot + '/room/v1/Room/room_init?id=' + chatID
  const res = await axios.get(url)
  const data = res.data.data
  console.log(data)

  return {
    roomId: +data.room_id,
    /**
     * 0 未开播
     * 1 开播
     */
    status: +data.live_status
  }
}

export async function getRoomInfo(roomID: number) {
  const url = apiRoot + '/room/v1/Room/get_info?id=' + roomID

  const res = await axios.get(url)
  return res.data as string
}
