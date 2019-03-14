import { connectToClient, CmdType } from '../src'

async function start() {
  const client = await connectToClient(139)
  client.on(CmdType.danmu_msg, (data) => {
    console.log('Receive msg:', data)
  })
}

start()
