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

  on(event: DMEvent.close, listener: (byError: boolean) => void): this
  on(event: DMEvent.error, listener: (err: Error) => void): this
  on(event: DMEvent.online_changed, listener: (count: number) => void): this
  on(event: CmdType.danmu_msg, listener: (msg: DanmakuMsg) => void): this
  on(event: CmdType.send_gift | CmdType.guard_buy, listener: (msg: DanmakuGift) => void): this
  on(event: CmdType.welcome | CmdType.welcome_guard, listener: (msg: DanmakuUser) => void): this
  on(event: CmdType.live | CmdType.preparing, listener: (msg: DanmakuBase) => void): this
}
