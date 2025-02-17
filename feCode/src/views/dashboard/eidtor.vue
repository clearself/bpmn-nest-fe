<template>
  <MdEditor style="width: 100%; height: 88vh" v-model="text" :toolbars="toolbars" @onHtmlChanged="onInput">
    <template #defToolbars>
      <ExportPDF :modelValue="text" @onProgress="handleProgress" />
    </template>
  </MdEditor>
</template>

<script setup>
import { ref } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ExportPDF } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/style.css'
const emit = defineEmits(['onInput'])
const text = ref('# Hello Editor')
const onInput = (html) => {
  console.log(html, 'html')
  emit('onInput', html)
}

const toolbars = [
  'bold',
  0,
  'underline',
  'italic',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'revoke',
  'next',
  'save',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview'
]

const handleProgress = (progress) => {
  console.log(`Export progress: ${progress.ratio * 100}%`)
}
</script>
