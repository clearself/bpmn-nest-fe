<template>
  <div class="inner-html-container">
    <div class="page">
      <div class="tips">
        <div class="title">AI助手</div>
        <div class="desc" v-if="!isMobile">
          <!-- 该应用采取本地缓存的方式，不保留任何用户有关数据，请文明使用！ -->
        </div>
        <div @click="handleClearStorage" v-else class="pointer">清空</div>
      </div>
      <div class="grid-space-between" :class="!isMobile ? 'grid-box' : ''">
        <div class="left-container" v-if="!isMobile">
          <a-button type="primary" style="width: 100%" @click="handleAddSession">新建对话</a-button>
          <div class="session-area">
            <div
              class="session-item"
              :class="activeIndex == index ? 'session-item-active' : ''"
              v-for="(item, index) in sessionList"
              :key="index"
              @click="handleChangeSessionIndex(index)"
            >
              <span :class="activeIndex == index ? 'active-node' : 'normal-node'" v-if="editIndex != index">{{
                item.title
              }}</span>
              <a-input
                :ref="`renameRef_${index}`"
                autofocus
                v-model="item.title"
                v-else
                size="small"
                style="width: 120px"
                @blur="editIndex = -1"
                @change="editIndex = -1"
              />
              <div class="icon-box">
                <!-- 重命名 -->
                <EditFilled style="color: #e6a23c" @click.stop="handleFocusInput(index)" />
                <!-- 删除 -->
                <DeleteFilled style="color: #e6a23c" @click.stop="handleDeleteSession(index)" />
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="message-area">
            <MessageComp ref="messageRef" :message="queryInfos.messages" />
          </div>
          <div class="input-area" :class="isMobile ? 'left-space' : ''">
            <a-input
              allowClear
              v-model:value.trim="queryKeys"
              :placeholder="$t('inputTips')"
              @keyup.enter="handleRequest"
            />
            <a-button
              style="height: 40px; margin-left: 10px"
              type="primary"
              @click="handleRequest"
              :loading="loading"
              :disabled="!queryKeys"
              :icon="h(NotificationFilled)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, createVNode, h } from 'vue'
import OpenAI from 'openai'
import MessageComp from './components/messageComp.vue'
import { DeleteFilled, EditFilled, ExclamationCircleOutlined, NotificationFilled } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import MobileDetect from 'mobile-detect'
const messageRef = ref()
const isMobile = ref(false)
const sessionList = ref([])
const activeIndex = ref(-1)
const editIndex = ref(-1)
const queryKeys = ref('')
const openai = ref(null)
const loading = ref(false)
const queryInfos = ref({
  // { role: "assistant", content: "You are a helpful assistant." }
  // {"role": "user", "content": "What's the highest mountain in the world?"}
  messages: [],
  model: 'deepseek-chat',
  stream: true
})

watch(
  sessionList,
  (val) => {
    const list = val.map((o, i) => {
      if (i == activeIndex.value) {
        return {
          ...o,
          messages: queryInfos.value.messages
        }
      } else {
        return { ...o }
      }
    })
    localStorage.setItem('list', JSON.stringify(list))
  },
  {
    deep: true,
    immediate: false
  }
)

watch(
  activeIndex,
  (val) => {
    localStorage.setItem('index', JSON.stringify(val))
  },
  {
    deep: true,
    immediate: false
  }
)

// 手机端清空对话
const handleClearStorage = () => {
  localStorage.removeItem('list')
  localStorage.removeItem('index')
  queryInfos.value.messages = []
  sessionList.value = []
  activeIndex.value = -1
}
// 初始化对话列表
const initSessionList = () => {
  sessionList.value = JSON.parse(localStorage.getItem('list') || '[]')
}
// 初始化当前序号
const initIndex = () => {
  const listLen = JSON.parse(localStorage.getItem('list') || '[]').length // 对话列表
  const lastIndex = JSON.parse(localStorage.getItem('index') || '-1') // 当前对话的序号
  if (listLen) {
    activeIndex.value = lastIndex || 0
  } else {
    activeIndex.value = -1
  }
  if (activeIndex.value != -1) {
    queryInfos.value.messages = sessionList.value[activeIndex.value].messages || [] // 获取当前对话历史记录
  }
}
// 新增session对话
const handleAddSession = () => {
  if (loading.value) {
    message({ type: 'warning', message: '请当前问题查询完成后重试！' })
    return
  }
  sessionList.value.push({
    title: `对话${sessionList.value.length + 1}`,
    crtTime: new Date(),
    messages: []
  })
  queryInfos.value.messages = []
  activeIndex.value = sessionList.value.length - 1
}
// 删除对话
const handleDeleteSession = (index = 0) => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除当前对话？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      // 删除指定的对话
      sessionList.value.splice(index, 1)
      /**
       * 逻辑1:删除的当前选中的对话框，判断新的当前元素（原来的+1）是否存在，不存在则向前抓
       * 逻辑2:删除的非当前选中的(只判断小于，因为大于不影响当前展示内容)
       */
      if (index == activeIndex.value) {
        // 初始化index
        activeIndex.value = sessionList.value[index] ? index : --index
      } else if (index < activeIndex.value) {
        activeIndex.value = --activeIndex.value
      }
      // 更新页面数据展示
      queryInfos.value.messages = activeIndex.value > -1 ? sessionList.value[activeIndex.value] : []
      handleChangeSessionIndex(activeIndex.value)
    },
    onCancel() {
      Modal.destroyAll()
    }
  })
  Modal.confirm('确认删除当前对话？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
const handleFocusInput = (index) => {
  editIndex.value = index
  // nextTick(() => {
  //   this.$refs[`renameRef_${index}`][0].focus()
  // })
}
// 切换session对话序号
const handleChangeSessionIndex = (index) => {
  if (loading.value) {
    message({ type: 'warning', message: '请当前问题查询完成后重试！' })
    return
  }
  activeIndex.value = index
  queryInfos.value.messages = sessionList.value[activeIndex.value]?.messages || []
}
const initOpenAI = () => {
  openai.value = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-a7a8e5df8adb4957ab8a9f75cc634b9e',
    dangerouslyAllowBrowser: true
  })
}
// const initToken = async () => {
//   const res = await getTokens({
//     deepseek: 'Y',
//     gptToken: 'sk-a7a8e5df8adb4957ab8a9f75cc634b9e'
//   })
//   const { balance_infos = [] } = res
//   balance_infos.forEach((o) => {
//     totalAmt.value += Number(o.total_balance)
//   })
// }
// 点击进行提问
const handleRequest = async () => {
  if (!queryKeys.value) return
  if (!openai.value) initOpenAI()
  // 查询当前是否存在对话窗口，不存在的话，新建一个对话窗口
  if (!sessionList.value.length) {
    await handleAddSession()
  }
  // 1.向对话窗口添加对话信息(请求)
  queryInfos.value.messages.push({
    role: 'user',
    content: queryKeys.value
  })
  queryKeys.value = ''
  // 滚动到底部
  messageRef.value.scrollBottom()

  try {
    // 2.请求服务进行提问
    loading.value = true
    const response = await openai.value.chat.completions.create(queryInfos.value)
    queryInfos.value.messages.push({ role: 'assistant', content: '' })
    for await (const part of response) {
      queryInfos.value.messages[queryInfos.value.messages.length - 1].content += part.choices[0].delta.content
    }
    messageRef.value.scrollBottom()
    // 更新缓存数据
    sessionList.value[activeIndex.value].messages = queryInfos.value.messages
    loading.value = false
  } catch (error) {
    loading.value = false
    queryInfos.value.messages.push({
      role: 'assistant',
      content: '加载失败,请稍后重试!'
    })
  }
}

initSessionList()
initIndex()
initOpenAI()
// this.initToken()
// 监测当前设备是不是手机
const md = new MobileDetect(window.navigator.userAgent)
isMobile.value = md.mobile()
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.inner-html-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: rgb(216.8, 235.6, 255);
  .page {
    width: 76vw;
    height: 86vh;
    background: #fff;
    box-shadow: 0 0 12px 12px rgb(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 8px;
    overflow: hidden;
    .tips {
      width: 100%;
      height: 32px;
      background: rgb(121.3, 187.1, 255);
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      box-sizing: border-box;
      .title {
        font-size: 16px;
      }
      .desc {
        font-size: 14px;
        color: rgb(216.8, 235.6, 255);
      }
    }
    .grid-box {
      display: grid;
      grid-template-columns: 24% auto;
      column-gap: 12px;
    }
    .grid-space-between {
      width: 100%;
      height: calc(100% - 48px);
      .left-container {
        background-color: #f7f8fa;
        padding: 12px;
        height: calc(86vh - 32px - 24px); // 顶部比标题、padding边框
        // 对话列表的展示区域
        .session-area {
          width: 100%;
          height: calc(86vh - 32px - 24px - 12px - 32px); // 边框+按钮
          margin-top: 12px;
          box-sizing: border-box;
          overflow-y: auto;
          .session-item {
            height: 36px;
            line-height: 36px;
            margin-bottom: 8px;
            border-radius: 4px;
            padding: 0 18px;
            background: rgb(199.5, 201, 204);
            color: #f4f5f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            .normal-node {
              padding-left: 14px;
            }
            .icon-box {
              visibility: hidden;
              display: grid;
              column-gap: 8px;
              grid-template-columns: repeat(2, 1fr);
              .icon {
                cursor: pointer;
              }
            }
            &:hover .icon-box {
              visibility: visible;
            }
          }
          .session-item-active {
            background: rgb(51.2, 126.4, 204);
            color: #f4f5f5;
            .active-node {
              display: flex;
              align-items: center;
              &::before {
                display: inline-block;
                content: '';
                width: 6px;
                height: 6px;
                background: #fff;
                border-radius: 50%;
                margin-right: 8px;
              }
            }
          }
        }
      }
      .container {
        width: 100%;
        height: calc(86vh - 32px);
        background: #fff;
        border-radius: 8px;
        .message-area {
          height: calc(100% - 40px - 16px - 44px);
          width: calc(100% - 32px);
          padding: 16px 16px 0 16px;
        }
        .user-tokens {
          height: 30px;
          line-height: 30px;
          padding: 0 8px 0 0;
          font-size: 14px;
          color: #c7c8ca;
          user-select: none;
        }
        // 手机端留左侧边框
        .left-space {
          margin-left: 16px;
        }
        .input-area {
          height: 40px;
          display: grid;
          grid-template-columns: auto 90px;
          box-sizing: border-box;
          background: #fff;
          padding: 0 16px 16px 0;
        }
      }
    }
  }
}
</style>
