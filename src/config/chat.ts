// src/types/chat.ts
export interface Message {
  /** 消息唯一ID */
  id: string
  /** 发送方身份：user-用户 / assistant-助手 */
  role: 'user' | 'assistant'
  /** 消息内容（支持Markdown） */
  content: string
  /** 是否结束标记 */
  done: boolean
  /** 时间戳 */
  timestamp: number
}

/** 流式响应数据块格式 */
export type MessageChunk = {
  /** 当前片段内容 */
  content: string
  /** 是否结束标记 */
  done: boolean
}
