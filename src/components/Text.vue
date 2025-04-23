<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import mdKatex from '@traptitech/markdown-it-katex'
import 'highlight.js/scss/atom-one-dark-reasonable.scss'

interface Props {
  error?: boolean
  text?: string
  loading?: boolean
  once?: boolean
  html?: boolean
  interval?: number
}
const props = withDefaults(defineProps<Props>(), {
  html: true,
  interval: 30,
  loading: true,
  text: ''
})

const emits = defineEmits(['end'])

const mdi = new MarkdownIt({
  linkify: true,
  html: props.html,
  highlight(code: string, language = 'sh') {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang, code)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '', code)
  }
})

mdi.use(mdKatex, {
  blockClass: 'katexmath-block',
  errorColor: ' #cc0000'
})

// 自定义渲染规则，不使用 <pre> 标签包裹代码块
mdi.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const token = tokens[idx]
  const code = token.content
  const lang = token.info
  return options.highlight?.(code, lang, '') || code
}

const render = computed(() => {
  let value = outputText.value
  const count = value.split('```').length - 1

  // 闭合代码块，兼容 loading
  if (count % 2 === 1) {
    let t = '\n```'
    if (value[value.length - 1] === '`') {
      t = '``'
      if (value[value.length - 2] === '`') {
        t = '`'
        if (value[value.length - 3] === '`') t = '\n```'
      }
    }

    value += `${t}`
  }
  const loadingHTML = `${value[value.length - 1] === '`' ? '\n' : ''}${
    props.html ? '<span class="loading">▎</span>' : ''
  }`
  const temp =
    mdi.render(value.replace(/(\n)(?![^`]*```)/g, '\n\n') + (props.loading || typeing ? loadingHTML : '')) ||
    (props.error ? '出错啦！' : '')
  return temp
})

function highlightBlock(str: string, lang: string, code: string) {
  return `<div class="language-${lang} vp-adaptive-theme">
    <button
      class="copy"
      title="Copy Code"
      onclick="copyToClip(this)"
    >
    </button>
    <span class="lang">${lang}</span>
    <pre class="shiki github-dark vp-code-dark"><code>${str}</code></pre>
    <pre class="shiki github-light vp-code-light"><code>${str}</code></pre>
  </div>
  `
}

let currentIndex = 0
let timer: number, timer2: number
const bgc = ref('currentColor')
const display = ref('inline-block')

timer2 = window.setInterval(() => {
  if (props.loading || typeing) bgc.value = bgc.value === 'currentColor' ? 'transparent' : 'currentColor'
  else {
    clearInterval(timer2)
    emits('end')
    display.value = 'none'
  }
}, 1200)

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(timer2)
})
let typeing = true
const outputText = ref('')
const typeText = () => {
  if (currentIndex < props.text!.length) {
    outputText.value += props.text![currentIndex]
    currentIndex++
  } else {
    clearInterval(timer)
    if (props.once) {
      emits('end')
      display.value = 'none'
      clearInterval(timer2)
      bgc.value = 'transparent'
    }
  }
  typeing = currentIndex <= props.text!.length - 1
}

watch(
  () => props.text,
  async (newVal = '') => {
    if (!props.loading) {
      outputText.value = newVal
      typeing = false
      return
    }
    clearInterval(timer)
    timer = window.setInterval(typeText, props.interval)
    return
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="gpt-text" :class="error ? 'error' : ''">
    <div class="markdown-body" v-html="render" />
    <span v-if="!props.html" class="loading">▎</span>
  </div>
</template>

<style lang="scss" scoped>
@keyframes blink {
  0%,
  100% {
    background-color: currentColor;
  }

  50% {
    background-color: transparent;
  }
}

.gpt-text {
  overflow-wrap: break-word;
  max-width: 100%;
  display: flex;
  &.error {
    color: var(--el-color-danger);
  }
}

:deep() {
  .markdown-body {
    &::before {
      display: none;
    }
    > p:first-child {
      margin-top: 0;
    }
    > p:last-of-type {
      margin-bottom: 0;
    }
    div[class*='language-'] {
      min-width: 300px;
      min-height: 52px;
      max-width: 100%;
      border-radius: 8px;
    }
  }
  .loading {
    display: v-bind(display);
    color: v-bind(bgc);
    transition: var(--el-transition-all);
    vertical-align: middle;
    margin-left: 0.2em;
  }
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
