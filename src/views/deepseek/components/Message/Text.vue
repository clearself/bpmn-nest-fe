<template>
  <div :class="wrapClass">
    <div ref="textRef" class="leading-relaxed break-words">
      <div v-if="!inversion">
        <template v-if="!asRawText">
          <!-- <div class="flex">
            <div
              @click="changeShowReasoning"
              class="bg-#525252 h-32px px-10px mb-10px leading-32px rounded-8px cursor-pointer"
            >
              已深度思考
            </div>
          </div> -->
          <!--  <div class="ub ub-f1 ub-ac">
              <div v-html="reasoningVal" />
              <div style="margin-left: 5px"><sync-outlined spin /></div>
            </div> -->
          <div
            v-if="reasoningVal && showReasoning"
            class="markdown-body text-#a6a6a6 pl-13px border-l mb-10px"
            v-html="reasoningVal"
          />
          <div v-if="textVal" class="markdown-body" :class="{ 'markdown-body-generate': loading }" v-html="textVal" />
        </template>
        <div v-else class="whitespace-pre-wrap" v-text="textVal" />
      </div>
      <div v-else class="whitespace-pre-wrap" v-text="textVal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'
import MdKatex from '@vscode/markdown-it-katex'
import 'katex/dist/katex.min.css'
import MdLinkAttributes from 'markdown-it-link-attributes'
import MdMermaid from 'mermaid-it-markdown'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('xml', xml)
import { copyToClip } from '@/utils/copy'
const props = defineProps<{
  inversion?: boolean
  error?: boolean
  text?: string
  reasoning?: string
  loading?: boolean
  asRawText?: boolean
}>()

const showReasoning = ref(true)
function changeShowReasoning() {
  showReasoning.value = !showReasoning.value
}
const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})

mdi
  .use(MdLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
  .use(MdKatex)
  .use(MdMermaid)
const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-20px',
    'rounded-md',
    'px-3 py-2',
    props.inversion ? 'bg-#d2f9d1' : 'bg-#f4f6f8',
    props.inversion ? 'dark:bg-#414158' : 'dark:bg-#1e1e20',
    props.inversion ? 'message-request' : 'message-reply',
    { 'text-red-500': props.error }
  ]
})
const textVal = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText) {
    // 对数学公式进行处理，自动添加 $$ 符号
    const escapedText = escapeBrackets(escapeDollarNumber(value))
    return mdi.render(escapedText)
  }
  return value
})
const reasoningVal = computed(() => {
  const value = props.reasoning ?? ''
  if (!props.asRawText) {
    // 对数学公式进行处理，自动添加 $$ 符号
    const escapedText = escapeBrackets(escapeDollarNumber(value))
    return mdi.render(escapedText)
  }
  return value
})
function highlightBlock(str: string, lang?: string) {
  return `<div class="code-block"><div class="ub w100 ub-ac ub-pj code-header"><div class="lang-name">${lang}</div><div class="code-block-header__copy">复制代码</div></div><pre class="hljs"><code>${str}</code></pre></div>`
  // return `<pre class="code-block-wrapper"><div class=""ub w100 ub-ac ub-pj code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

function escapeBrackets(text: string) {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g
  return text.replace(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock) return codeBlock
    else if (squareBracket) return `$$${squareBracket}$$`
    else if (roundBracket) return `$${roundBracket}$`
    return match
  })
}
function escapeDollarNumber(text: string) {
  let escapedText = ''

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i]
    const nextChar = text[i + 1] || ' '

    if (char === '$' && nextChar >= '0' && nextChar <= '9') char = '\\$'

    escapedText += char
  }

  return escapedText
}
const textRef = ref<HTMLElement>()
function addCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.nextElementSibling?.textContent
        if (code) {
          copyToClip(code).then(() => {
            btn.textContent = '复制成功'
            setTimeout(() => {
              btn.textContent = '复制代码'
            }, 1000)
          })
        }
      })
    })
  }
}

function removeCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {})
    })
  }
}
onMounted(() => {
  addCopyEvents()
})

onUpdated(() => {
  addCopyEvents()
})

onUnmounted(() => {
  removeCopyEvents()
})
</script>
<style lang="scss">
@import url('./style.scss');
.text-wrap {
  text-wrap: wrap;
}
.min-w-20px {
  min-width: 20px;
}
.rounded-md {
  border-radius: 0.375rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.bg-#d2f9d1 {
  background-color: #d2f9d1;
}
.bg-#f4f6f8 {
  background-color: #f4f6f8;
}
// .dark.bg-#414158 {
//   background-color: #414158;
// }
// .dark:bg-#1e1e20 {
//   background-color: #1e1e20;
// }
</style>
