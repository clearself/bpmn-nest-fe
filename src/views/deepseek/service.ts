import fetchRequest from '@/utils/fetch'
export function chatCompletions(
  stream: AbortSignal,
  messages: Chat.ConversationMessage[],
  isDeep: boolean,
  useSearch: boolean
) {
  const url = isDeep ? '/v1/chat/completions' : '/chat/completions'
  return fetchRequest(url, {
    method: 'POST',
    body: JSON.stringify({
      model: isDeep ? 'deepseek-reasoner' : 'deepseek-chat',
      messages: messages,
      stream: true,
      stream_options: {
        include_usage: true
      },
      use_search: useSearch || true // 联网搜索开关‌
    }),
    signal: stream
  })
}
