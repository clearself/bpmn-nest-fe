<template>
  <div class="ub ub-ver ub-ac ub-pc ub-f1">
    <!-- <div class="h-50px leading-50px text-20px text-center px-20px" v-if="dataSources.length">
      {{ currentChatHistory?.title }}
    </div> -->
    <main class="main-content w100" :class="{ 'ub-f1': dataSources.length }">
      <el-scrollbar ref="scrollRef" class="w100 pt-1">
        <div class="message-list">
          <Welcome
            v-if="!dataSources.length"
            class="mb-2"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="主人，我是你的AI小助手"
            description="有什么问题可以直接向我咨询~"
          >
            <!-- <template #extra>
              <a-space>
                <a-button>
                  <template #icon>
                    <ShareAltOutlined />
                  </template>
                </a-button>
                <a-button>
                  <template #icon>
                    <EllipsisOutlined />
                  </template>
                </a-button>
              </a-space>
            </template> -->
          </Welcome>
          <div v-else>
            <MessageItem
              v-for="(item, index) of dataSources"
              :key="index"
              :date-time="item.dateTime"
              :text="item.text"
              :question="item.question"
              :reasoning="item.reasoning"
              :inversion="item.inversion"
              :error="item.error"
              :loading="item.loading"
              @reanswer="reanswer"
            />
          </div>
        </div>
        <a-back-top class="sender-back-top" />
      </el-scrollbar>
    </main>
    <footer class="ub ub-ac ub-pc w100 sender-box">
      <a-button v-if="isBottom" class="back-top-btn" shape="circle" :icon="h(DownOutlined)" @click="scrollToBottom" />
      <!--
        :prefix="badgeNode"


        :allowSpeech="true"-->
      <Sender
        class="sender-item"
        :value="prompt"
        @change="changeVal"
        placeholder="请输入内容~~"
        ref="senderRef"
        @submit="senderSubmit"
      >
        <template #header>
          <Sender.Header title="" :open="open" @open-change="(v: boolean) => (open = v)">
            <a-space>
              <a-button
                v-if="deepSearch"
                type="primary"
                size="small"
                :icon="h(TrademarkCircleOutlined)"
                @click="deepSearchChange"
                >深度思考(R1)</a-button
              >

              <a-button v-else size="small" :icon="h(TrademarkCircleOutlined)" @click="deepSearchChange"
                >深度思考(R1)</a-button
              >

              <a-button v-if="netSearch" type="primary" size="small" :icon="h(GlobalOutlined)" @click="netSearchChange"
                >联网搜索</a-button
              >

              <a-button v-else size="small" :icon="h(GlobalOutlined)" @click="netSearchChange">联网搜索</a-button>
            </a-space>
          </Sender.Header>
        </template>
      </Sender>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import { Sender, Welcome } from 'ant-design-x-vue'
import { DownOutlined, GlobalOutlined, TrademarkCircleOutlined } from '@ant-design/icons-vue'
import MessageItem from './components/Message/index.vue'
import { chatCompletions } from './service'
import { useChat } from './hooks/useChat'
import { useScroll } from './hooks/useScroll'
import { useChatStore } from '@/store/modules/chat'
import { useRoute } from 'vue-router'
import { useReadStream } from './hooks/useReadStream'
import { ss } from '@/utils/storage'
let controller = new AbortController()
const chatStore = useChatStore()
const route = useRoute()

// 会话方法
const { addChat, updateChat } = useChat()
const { scrollRef, isBottom, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { handleStreamResponse } = useReadStream()
const { uuid } = route.params as { uuid: string }
// 输入框
const prompt = ref<string>('')
const loading = ref<boolean>(false)
const deepSearch = computed(() => {
  return chatStore.deepSearch
})
const netSearch = computed(() => {
  return chatStore.netSearch
})
const deepSearchChange = () => {
  chatStore.deepSearch = !deepSearch.value
}

const netSearchChange = () => {
  chatStore.netSearch = !netSearch.value
}
const open = ref(true)
// const items = ref<any[]>([])
// 对话信息
const dataSources = computed(() => {
  const list = chatStore.getChatByUuid(+uuid)
  console.log(list, 'list')
  return list
})
// const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

// 是否开启多轮对话，开启后会带上之前的聊天信息
const usingContext = computed<boolean>(() => chatStore.usingContext)

const changeVal = (val: any) => {
  prompt.value = val
}

const senderRef = ref<InstanceType<typeof Sender>>()
const reanswer = (question: string) => {
  prompt.value = question
  onConversation()
}

// 提交处理
const senderSubmit = () => {
  if (!+uuid || +uuid === 0) {
    chatStore.addHistory({
      title: '新建会话',
      uuid: Date.now(),
      isEdit: false,
      visible: false
    })
    ss.set('chatSubmitPrompt', prompt.value)
    return
  }
  onConversation()
}
async function onConversation() {
  const message = prompt.value
  if (loading.value) return
  if (!message || message.trim() === '') return
  // 流式输出信号
  controller = new AbortController()
  const conversationList = dataSources.value
    .filter((item) => item.text)
    .map(
      (item) =>
        ({
          role: item.inversion ? 'user' : 'assistant',
          content: item.text
        }) as Chat.ConversationMessage
    )
  // 添加用户消息到对话框
  addChat(+uuid, {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false
  })
  scrollToBottom()
  loading.value = true
  const question = prompt.value
  prompt.value = ''
  // 添加AI初始对话 思考信息
  addChat(+uuid, {
    dateTime: new Date().toLocaleString(),
    question: question,
    text: '',
    reasoning: '思考中...',
    loading: true,
    inversion: false,
    error: false
  })
  scrollToBottom()
  // 开始发起请求
  try {
    const paramMsg = []
    if (usingContext.value) {
      // AI回复
      paramMsg.push(...conversationList)
    }
    paramMsg.push({ role: 'user', content: message })
    const response: any = await chatCompletions(controller.signal, paramMsg, deepSearch.value, netSearch.value)
    await handleStreamResponse(response, (jsonData: any) => {
      const contentText = jsonData.choices[0]?.delta?.content
      if (contentText) {
        updateChat(+uuid, dataSources.value.length - 1, {
          text: contentText ?? '',
          inversion: false,
          error: false,
          loading: true
        })
        scrollToBottomIfAtBottom()
      }
      // 思考信息
      const reasoning = jsonData.choices[0].delta.reasoning_content
      if (reasoning) {
        updateChat(+uuid, dataSources.value.length - 1, {
          reasoning: reasoning ?? '',
          reasoningTime: new Date().toLocaleString(),
          inversion: false,
          error: false,
          loading: true
        })
        scrollToBottomIfAtBottom()
      }
    })
    updateChat(+uuid, dataSources.value.length - 1, {
      inversion: false,
      error: false,
      loading: false
    })
    loading.value = false
    console.log('Stream ended')
  } catch (error: any) {
    console.log(error)
    loading.value = false
    if (error instanceof DOMException && error.name === 'AbortError') {
      updateChat(+uuid, dataSources.value.length - 1, {
        text: '\n\n用户手动中断。',
        inversion: false,
        error: false,
        loading: false
      })
    } else {
      updateChat(+uuid, dataSources.value.length - 1, {
        text: '\n\n服务器异常，请稍后再试。',
        inversion: false,
        error: true,
        loading: false
      })
    }
  }
}

// function handleStop() {
//   if (loading.value) {
//     controller.abort()
//     loading.value = false
//   }
// }
onMounted(() => {
  if (!route.params.uuid) {
    chatStore.active = 1002
  }
  const promptValue = ss.get('chatSubmitPrompt')
  if (promptValue) {
    prompt.value = promptValue
    ss.set('chatSubmitPrompt', '')
    onConversation()
  }
  scrollToBottom()
})
onUnmounted(() => {
  if (loading.value) controller.abort()
})
</script>

<style lang="scss" scoped>
.main-content {
  overflow: hidden;
}
.message-list {
  width: 100%;
  max-width: 768px;
  margin: auto;
}
.sender-box {
  height: 200px;
  position: relative;
  .sender-item {
    width: 768px;
  }
  .back-top-btn {
    position: absolute;
    left: 50%;
    top: -40px;
    transform: translateX(-50%);
  }
}

.overflow-hidden {
  overflow: hidden;
}
</style>
