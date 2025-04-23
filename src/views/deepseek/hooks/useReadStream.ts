export function useReadStream() {
  // 读取流信息
  async function handleStreamResponse(response: any, onMessage: (jsonData: any) => void) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    let buffer = ''
    while (!done) {
      const { value, done: isDone } = await reader.read()
      done = isDone
      buffer += decoder.decode(value, { stream: true })
      // 检查是否有完整的 JSON 数据（以 `\n` 结束）
      if (!buffer.includes('\n')) continue
      const messages = buffer.split('\n')
      for (const message of messages) {
        // 去掉 'data:' 前缀
        const jsonStr = message.replace(/^\s*data: \s*/, '').trim()
        if (jsonStr !== '[DONE]') {
          if (jsonStr === '') continue
          try {
            // 解析 JSON 数据
            const jsonData = JSON.parse(jsonStr)
            onMessage(jsonData)
          } catch (error) {
            console.error('Error parsing JSON:', error)
          }
        } else {
          done = true
        }
      }
      // 清空缓冲区，准备接收新的数据
      buffer = ''
    }
  }
  return { handleStreamResponse }
}
