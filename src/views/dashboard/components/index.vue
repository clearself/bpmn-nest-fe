<template>
  <a-flex gap="large" vertical class="message-box">
    <div ref="chatContainer" class="chat-container">
      <div class="message-list">
        <Welcome
          v-if="messages.length === 0"
          class="mb-2"
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="Hello, I'm Ant Design X"
          description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        >
          <template #extra>
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
          </template>
        </Welcome>
        <div class="mb-2" v-for="msg in messages" :key="msg.id">
          <Bubble
            v-if="msg.role === 'user'"
            :class="['message', msg.role]"
            placement="end"
            :content="msg.content"
            :avatar="{ icon: h(UserOutlined), style: barAvatar }"
          />

          <!-- <TextIt v-else :html="true" :text="msg.content" once /> -->

          <Bubble
            v-else
            :class="['message', msg.role]"
            placement="start"
            :avatar="{ icon: h(UserOutlined), style: fooAvatar }"
          >
            <template #message>
              <div class="message-assistant" v-html="renderMarkdown(msg.content)" />
            </template>
            <template #footer>
              <div class="message-loading pl-2" v-if="!msg.done">
                <Spin />
              </div>
              <a-space v-else class="pl-2">
                <a-button type="text" size="small" :icon="h(SyncOutlined)" />
                <a-button type="text" size="small" :icon="h(CopyOutlined)" />
              </a-space>
            </template>
          </Bubble>
        </div>
      </div>
    </div>
    <Sender
      class="sender-box"
      :allowSpeech="true"
      :value="text"
      :prefix="badgeNode"
      :header="senderHeader"
      @change="changeVal"
      placeholder="请输入内容~~"
      ref="senderRef"
      @submit="senderSubmit"
    />
  </a-flex>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { h, ref, computed, watch, nextTick } from 'vue'
import { Bubble, Attachments, Sender, Welcome } from 'ant-design-x-vue'

import type { BubbleProps } from 'ant-design-x-vue'
import { message, Button, Badge, Typography, Spin, type UploadFile } from 'ant-design-vue'

import {
  UserOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
  CopyOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  LinkOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'
import { useChatStream } from '@/hooks/useStream'
import type { Message } from '@/config/chat'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import MarkdownItCollapsible from 'markdown-it-collapsible'

import hljs from 'highlight.js'

import 'highlight.js/styles/github-dark.css'

import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('xml', xml)
const md: MarkdownIt = MarkdownIt({
  html: true,
  linkify: true,
  highlight: function (str: string, lang: string) {
    const language = hljs.getLanguage(lang)
    let highlighted = ''
    if (language) {
      try {
        highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch (error) {}
    } else {
      highlighted = md.utils.escapeHtml(str)
    }
    return `<div class="code-block"><div class="ub w100 ub-ac ub-pj code-header"><div><b class="lang-name">${lang}</b></div><div><button class="copy-btn">复制</button></div></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
  }
})
  .use(mdKatex)
  .use(MarkdownItCollapsible)

// defineOptions({ name: 'AXBubbleAvatarAndPlacementSetup' })
// const { streamChat, isStreaming, isThinking, error, abort } = useChatStream()
const messages = ref<Message[]>([])
const text = ref('')
const chatContainer = ref<HTMLElement>()

const open = ref(false)
const items = ref<any[]>([])
const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf'
}
const renderMarkdown = (content: any) => {
  return md.render(content)
}
const changeVal = (val: any) => {
  text.value = val
}
const barAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068'
}

const senderRef = ref<InstanceType<typeof Sender>>()

const senderHeader = computed(() =>
  h(
    Sender.Header,
    {
      title: 'Attachments',
      styles: {
        content: {
          padding: 0
        }
      },
      open: open.value,
      onOpenChange: (v: boolean) => (open.value = v),
      forceRender: true
    },
    {
      default: () =>
        h(Attachments, {
          beforeUpload: () => false,
          items: items.value,
          onChange: ({ fileList }: { fileList: any[] }) => (items.value = fileList),
          placeholder: (type: string) =>
            type === 'drop'
              ? { title: 'Drop file here' }
              : {
                  icon: h(CloudUploadOutlined),
                  title: 'Upload files',
                  description: 'Click or drag files to this area to upload'
                },
          getDropContainer: () => senderRef.value?.nativeElement
        })
    }
  )
)
const badgeNode = computed(() =>
  h(
    Badge,
    { dot: items.value.length > 0 && !open.value },
    {
      default: () =>
        h(Button, {
          onClick: () => (open.value = !open.value),
          icon: h(LinkOutlined)
        })
    }
  )
)

// 自动滚动到底部
watch(
  messages,
  async () => {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  },
  { deep: true }
)

// 提交处理
const senderSubmit = (message: string) => {
  // console.log(message, 'message')
  // console.log(text.value, 'input.value')
  // if (!text.value.trim() || isStreaming.value) return
  // streamChat(messages, text.value)
  // text.value = ''
  // items.value = []

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
  // onConversation()
}
</script>

<style lang="scss" scoped>
.message-box {
  width: 100%;

  .chat-container {
    width: 100%;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
  .message-list {
    width: 60%;
    min-width: 750px;
    margin: 30px auto 0;
  }
  .sender-box {
    width: 60%;
    min-width: 750px;
    margin: 0px auto;
  }
}
.message :deep(.ant-bubble-content-filled) {
  background-color: transparent !important;
}
:deep(.message-assistant) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
  }
  * {
    font-size: 15px;
    line-height: 1.75;
  }
}
:deep(.code-block) {
  background-color: rgba(9, 9, 11, 1);
  .code-header {
    padding: 5px 10px;
    background-color: rgba(31, 41, 55, 1);
    .lang-name {
      color: #999999;
    }
  }
  pre.hljs {
    padding: 10px;
  }
}
</style>
