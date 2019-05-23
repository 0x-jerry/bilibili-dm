import axios from 'axios'

const apiRoot = 'https://api.live.bilibili.com'

axios.defaults.baseURL = apiRoot

async function get(path: string, params?: { [key: string]: any }) {
  const res = await axios.get(path, { params })
  return res.data.data
}

export interface IServerConf {
  host: string
  port: number
  ws_port: number
  wss_port: number
}

async function getLiveConf(roomID: number) {
  const data = await get('/room/v1/Danmu/getConf', { room_id: roomID })

  return {
    host: data.host,
    port: data.port,
    servers: data.host_server_list as IServerConf[],
    token: data.token as string
  }
}

async function getRoomInfo(chatID: number) {
  const data = await get('/room/v1/Room/get_info', { id: chatID })

  return {
    roomID: +data.room_id,
    /**
     * 0: 未开播
     * 1: 开播
     */
    status: +data.live_status,
    cover: data.user_cover
  }
}

export { get, getLiveConf, getRoomInfo }
