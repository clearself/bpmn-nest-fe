import { defineStore } from 'pinia'
import router from '@/routers/index'
import { ss } from '@/utils/storage'
export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => {
    const uuid = 1002
    const localState = ss.get('chatStore')
    return {
      ...{
        history: [], // 历史对话列表
        active: uuid, // 当前对话id
        deepSearch: true, // 是否开启深度搜索
        netSearch: true, // 联网搜索开关‌
        chat: [{ uuid, data: [] }], // 对话数据
        usingContext: true // 开启多轮对话
      },
      ...localState
    }
  },
  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex((item) => item.uuid === state.active)
      if (index !== -1) return state.history[index]
      return null
    },
    // 根据id获取对话信息
    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid) {
          return state.chat.find((item) => item.uuid === uuid)?.data ?? []
        } else {
          return state.chat.find((item) => item.uuid === state.active)?.data ?? []
        }
      }
    }
  },
  actions: {
    createNewChat() {
      this.active = 1002
      this.reloadRoute('')
    },
    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      console.log(history, chatData)
      this.history.unshift(history)
      this.chat.unshift({ uuid: history.uuid, data: chatData })
      this.active = history.uuid
      this.reloadRoute(history.uuid)
    },
    deleteHistory(uuid: number) {
      const index = this.history.findIndex((item) => item.uuid === uuid)
      if (index !== -1) {
        this.history.splice(index, 1)
        this.recordState()
      }
      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat.splice(chatIndex, 1)
        this.recordState()
      }
      if (this.active === uuid) {
        this.active = 1002
        this.reloadRoute('')
      }
    },
    updateHistory(uuid: number, edit: Partial<Chat.History>) {
      const index = this.history.findIndex((item) => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState()
      }
    },
    async setActive(uuid: number | undefined) {
      this.active = uuid || 1002
      return await this.reloadRoute(uuid)
    },
    async reloadRoute(uuid?: number | '') {
      this.recordState()
      await router.push({ name: 'Chat', params: { uuid } })
    },
    // 根据uuid添加对话
    addChatByUuid(uuid: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text?.substring(0, 10), isEdit: false, visible: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        } else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === '新建会话') this.history[0].title = chat.text?.substring(0, 50)
          this.recordState()
        }
      }
      const index = this.chat.findIndex((item) => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title === '新建会话') this.history[index].title = chat.text?.substring(0, 50)
        this.recordState()
      }
    },
    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          if (this.chat[0].data[index].reasoning == '思考中...') {
            this.chat[0].data[index].reasoning = ''
          }
          if (chat.reasoning) {
            chat.reasoning = this.chat[0].data[index].reasoning! + chat.reasoning
          }
          if (chat.text) {
            chat.text = this.chat[0].data[index].text! + chat.text
          }
          const newChat = {
            ...this.chat[0].data[index],
            ...chat
          }
          this.chat[0].data[index] = newChat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid)
      if (chatIndex !== -1) {
        if (this.chat[chatIndex].data[index].reasoning == '思考中...') {
          this.chat[chatIndex].data[index].reasoning = ''
        }
        if (chat.reasoning) {
          chat.reasoning = this.chat[chatIndex].data[index].reasoning! + chat.reasoning
        }
        if (chat.text) {
          chat.text = this.chat[chatIndex].data[index].text! + chat.text
        }
        const newChat = {
          ...this.chat[chatIndex].data[index],
          ...chat
        }
        this.chat[chatIndex].data[index] = newChat
        this.recordState()
      }
    },
    recordState() {
      ss.set('chatStore', this.$state)
    }
  }
})
