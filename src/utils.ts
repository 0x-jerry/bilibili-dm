import axios from 'axios'
import * as xml2js from 'xml2js'

export async function getRoomInfo(roomID: number) {
  const url = 'http://live.bilibili.com/api/player?id=cid:' + roomID
  const res = await axios.get(url)

  return res.data as string
}

export async function getRoomID(chatID: number) {
  const url = 'http://api.live.bilibili.com/room/v1/Room/room_init?id=' + chatID
  const res = await axios.get(url)

  return +res.data.data.room_id
}

export function parseXml(xmlString: string): Promise<any> {
  const data = `<root>${xmlString}</root>`

  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.root)
      }
    })
  })
}
