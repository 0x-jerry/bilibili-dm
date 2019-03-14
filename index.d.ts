import { EventEmitter } from 'events'
import { Socket } from 'net'
import { CmdType, DMEvent, DanmakuMsg, DanmakuGift, DanmakuUser, DanmakuBase } from './src'

export class DMClient extends EventEmitter {
  host: string
  port: number
  roomID: number
  cacheData: Buffer
  client: Socket

  constructor(host: string, port: number, roomID: number)

  on(event: DMEvent.close | 'close', listener: (byError: boolean) => void): this
  on(event: DMEvent.data | 'data', listener: (parsed: Partial<DanmakuMsg & DanmakuGift>, rawData: any) => void): this
  on(event: DMEvent.error | 'error', listener: (err: Error) => void): this
  on(event: DMEvent.online_changed | 'online_changed', listener: (count: number) => void): this
  on(event: CmdType.danmu_msg | 'danmu_msg', listener: (msg: DanmakuMsg) => void): this
  on(event: CmdType.send_gift | 'send_gift', listener: (msg: DanmakuGift) => void): this
  on(event: CmdType.guard_buy | 'guard_buy', listener: (msg: DanmakuGift) => void): this
  on(event: CmdType.welcome | 'welcome', listener: (msg: DanmakuUser) => void): this
  on(event: CmdType.welcome_guard | 'welcome_guard', listener: (msg: DanmakuUser) => void): this
  on(event: CmdType.live | 'live', listener: (msg: DanmakuBase) => void): this
  on(event: CmdType.preparing | 'preparing', listener: (msg: DanmakuBase) => void): this
}
