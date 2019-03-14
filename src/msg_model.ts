export enum CmdType {
  danmu_msg = 'danmu_msg',
  welcome_guard = 'welcome_guard',
  welcome = 'welcome',
  send_gift = 'send_gift',
}

interface DanmakuUser {
  username: string
  userID: number
  isAdmin: boolean
  isVip: boolean
}

interface DanmakuBase {
  raw: JSON
  cmd: CmdType
}

export interface DanmakuGift extends DanmakuBase, DanmakuUser {
  giftName: string
  giftCount: number
}

export interface DanmakuMsg extends DanmakuBase, DanmakuUser {
  content: string
}
