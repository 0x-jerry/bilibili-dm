# Bilibili 直播间弹幕获取

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