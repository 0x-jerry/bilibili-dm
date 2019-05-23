import { connectToClient, DMEvent, DanmakuData, CmdType } from '../src'

async function start() {
  const client = await connectToClient(531)
  client.on(DMEvent.data, (data: DanmakuData) => {
    const { raw, ...msg } = data
    if (msg.cmd === CmdType.danmu_msg) {
      console.log(`[${msg.username}]: ${msg.content}`)
    } else {
      console.log(msg)
    }
  })
}

start()
