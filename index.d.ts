import { EventEmitter } from 'events'
import { Socket } from 'net'

export class DMClient extends EventEmitter {
  host: string
  port: number
  roomID: number
  cacheData: Buffer
  client: Socket

  constructor(host: string, port: number, roomID: number)

  on(event: 'close', listener: (byError: boolean) => void): this
  on(event: 'error', listener: (err: Error) => void): this
  on(event: 'online_update', listener: (count: number) => void): this
}
