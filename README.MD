# Bilibili 直播间弹幕获取


> 此仓库实现的 弹幕协议 现已过期，最新协议请参考：https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md

## Example

如果要获取直播地址 `https://live.bilibili.com/6` 的弹幕

TypeScript 示例：

```ts
import { connectToClient, DMEvent, DanmakuData, CmdType } from './src'

async function start() {
  const client = await connectToClient(6)
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
```

## How To Use 

1. clone 本仓库
2. 执行 `npm run build`
3. 复制 `dist` 文件下的代码即可使用