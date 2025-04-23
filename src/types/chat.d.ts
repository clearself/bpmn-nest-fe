declare namespace Chat {
  interface Chat {
    dateTime?: string
    question?: string
    text?: string
    reasoning?: string
    reasoningTime?: string
    inversion?: boolean
    error?: boolean
    loading?: boolean
  }

  interface History {
    title?: string
    isEdit: boolean
    uuid: number
    visible: boolean
  }

  interface ChatState {
    active: number | null
    deepSearch: boolean
    netSearch: boolean
    usingContext: boolean
    history: History[]
    chat: { uuid: number; data: Chat[] }[]
  }

  interface ConversationRequest {
    conversationId?: string
    parentMessageId?: string
  }
  interface ConversationMessage {
    role: string
    content: string
  }
  interface ConversationResponse {
    model: string
    messages: ConversationMessage[]
    stream: boolean
    stream_options: {
      include_usage: boolean
    }
  }
}
