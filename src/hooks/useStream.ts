import { fetchEventSource } from '@microsoft/fetch-event-source'
import { ref, type Ref } from 'vue'
// import { marked } from "marked";
import type { Message, MessageChunk } from '@/config/chat'
const MAX_RETRIES = 3
const BASE_DELAY = 1000
const apiUrl = `https://api.deepseek.com/chat/completions`
const apiKey = `sk-2efcb362e07946eb85b7235951dc701d`
const startTime = Date.now()
let receivedChunks = 0
// const parseMarkdown = (raw:any) => {
//   return marked.parse(raw);
// }
export const useChatStream = () => {
  const controller = new AbortController()
  const isStreaming = ref(false)
  const isThinking = ref(false)
  const error = ref<Error | null>(null)
  let lastEventId = ''
  let retries = 0

  /** 中断请求 */
  const abort = () => {
    controller.abort()
    isStreaming.value = false
  }

  /** 流式对话处理 */
  const streamChat = async (messages: Ref<Message[]>, input: string) => {
    // 重置状态
    error.value = null
    retries = 0

    // 添加用户消息
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      done: false,
      timestamp: Date.now()
    }
    messages.value = [...messages.value, userMessage]

    // 初始化AI消息
    const assistantMessage: Message = {
      id: `temp_${Date.now()}`,
      role: 'assistant',
      content: '',
      done: false,
      timestamp: Date.now()
    }
    messages.value = [...messages.value, assistantMessage]

    isStreaming.value = true

    try {
      const params = {
        // model: 'deepseek-r1:8b',
        model: 'deepseek-chat',

        messages: [{ role: 'system', content: input }],
        stream: true
      }
      await fetchEventSource(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'Last-Event-ID': lastEventId
        },
        openWhenHidden: true, // 该属性主要是设置 避免多个接口返回信息
        body: JSON.stringify(params),
        signal: controller.signal,

        // 连接建立处理
        onopen: async (response) => {
          if (response.status !== 200) {
            throw new Error(`Server error: ${response.status}`)
          }

          isThinking.value = true
        },

        // 消息处理
        onmessage(ev: any) {
          isThinking.value = false
          receivedChunks++
          const latency = Date.now() - startTime

          const evData = JSON.parse(ev.data)
          console.log(`收到第${receivedChunks}个数据块，延迟: ${latency}ms`, evData)
          try {
            if (evData.id) lastEventId = evData.id

            const choicesDtat: any = evData.choices[0]

            const obj: any = {
              done: choicesDtat.finish_reason === 'stop' ? true : false,
              content: choicesDtat.delta.content
            }

            const _chunk = obj as MessageChunk
            if (_chunk.content === `<think>`) {
              _chunk.content = '<div class="think-box"><think>'
            }
            if (_chunk.content === `</think>`) {
              _chunk.content = '</think></div>'
            }
            const lastMsg: any = messages.value[messages.value.length - 1]
            // 拼接内容
            lastMsg.content += _chunk.content
            lastMsg.done = _chunk.done
            // 触发响应式更新
            messages.value = [...messages.value.slice(0, -1), lastMsg]
            if (_chunk.done) {
              abort()
            } // 流结束
          } catch (e) {
            console.error('消息解析失败:', e)
          }
        },

        // 错误处理（带指数退避重试）
        onerror(err) {
          console.log(err, 'err')
          if (retries < MAX_RETRIES && !controller.signal.aborted) {
            const delay = BASE_DELAY * Math.pow(2, retries)
            retries++
            setTimeout(() => streamChat(messages, input), delay)
          } else {
            error.value = new Error(`请求失败: ${err.message}`)
            isStreaming.value = false
          }
        },

        // 连接关闭
        onclose() {
          console.log(1, 'ev1')
          if (!controller.signal.aborted) {
            const lastMsg = messages.value[messages.value.length - 1]
            lastMsg.id = `msg_${Date.now()}`
            isStreaming.value = false
          }
        }
      })
    } catch (err) {
      error.value = err as Error
      isStreaming.value = false
    }
  }

  return { streamChat, isStreaming, isThinking, error, abort }
}
