export enum CmdType {
  live = 'live',
  preparing = 'preparing',
  danmu_msg = 'danmu_msg',
  send_gift = 'send_gift',
  gift_top = 'gift_top',
  welcome = 'welcome',
  welcome_guard = 'welcome_guard',
  guard_buy = 'guard_buy',
  unknown = 'unknown',
}

export interface DanmakuUser extends DanmakuBase {
  username: string
  userID: number
  isAdmin: boolean
  isVip: boolean
  guardLevel: number
}

export interface DanmakuBase {
  [key: string]: any
  roomID?: number
  raw: any
  cmd: CmdType
}

export interface DanmakuGift extends DanmakuBase, DanmakuUser {
  giftName: string
  giftCount: number
}

export interface DanmakuMsg extends DanmakuBase, DanmakuUser {
  content: string
}

export type DanmakuData = Partial<DanmakuGift & DanmakuMsg>

export function parseData(data: any): any {
  const msg: DanmakuData = {
    raw: data,
    cmd: data.cmd.toLowerCase(),
  }

  switch (msg.cmd) {
    case CmdType.live:
    case CmdType.preparing:
      msg.roomID = data.roomID
      break
    case CmdType.danmu_msg:
      msg.username = data.info[2][1]
      msg.userID = data.info[2][0]
      msg.isAdmin = !!data.info[2][2]
      msg.isVip = !!data.info[2][3]
      msg.guardLevel = data.info[7]

      msg.content = data.info[1]
      break
    case CmdType.send_gift:
      msg.username = data.data.uname
      msg.userID = data.data.uid

      msg.giftName = data.data.giftName
      msg.giftCount = data.data.num
      break
    case CmdType.gift_top:
      break
    case CmdType.welcome:
      msg.username = data.data.uname
      msg.userID = data.data.uid
      msg.isAdmin = !!data.data.is_admin
      msg.isVip = !!data.data.vip
      break
    case CmdType.welcome_guard:
      msg.username = data.data.uname
      msg.userID = data.data.uid
      msg.guardLevel = data.data.guard_level
      break
    case CmdType.guard_buy:
      msg.username = data.data.uname
      msg.userID = data.data.uid
      msg.guardLevel = data.data.guard_level

      const names = ['', '总督', '提督', '舰长']
      msg.giftName = names[msg.guardLevel]
      msg.giftCount = data.data.num
      break

    default:
      break
  }

  return msg
}
