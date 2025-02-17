<template>
  <div id="editor—wrapper">
    <div id="toolbar-container">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    </div>
    <div id="editor-container">
      <Editor
        style="min-height: 500px"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '@/utils/auth'
const token = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const mode = ref('default') // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const valueHtml = ref('')
const editorConfig: any = { placeholder: '请输入内容...', MENU_CONF: {} }
editorConfig.MENU_CONF['uploadImage'] = {
  server: '/api/common/upload',
  timeout: 5 * 1000, // 5s
  allowedFileTypes: ['image/*'],
  fieldName: 'file',
  // meta: { token: 'xxx', a: 100 },
  metaWithUrl: false, // join params to url
  headers: {
    Accept: 'text/x-json',
    Authorization: token ? 'Bearer ' + token : undefined
  },
  maxFileSize: 10 * 1024 * 1024, // 10M
  base64LimitSize: 5 * 1024 // insert base64 format, if file's size less than 5kb
}
watch(
  () => props.value,
  (newVal) => {
    if (editorRef.value) {
      if (newVal !== valueHtml.value) {
        valueHtml.value = newVal
      }
    }
  }
)

const toolbarConfig: any = {
  excludeKeys: ['insertLink', 'group-video', 'insertTable', 'codeBlock']
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const onChange = () => {
  const editor = editorRef.value
  console.log(editor.getHtml(), 33333)
  emit('update:value', editor.getHtml())
}
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>
<style scoped>
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
  font-size: inherit; /* 重置字体大小 */
  font-size: initial;
  color: inherit; /* 重置文本颜色 */
  color: initial;
}
#toolbar-container {
  border-bottom: 1px solid #ccc;
}
#editor-container {
  height: 500px;
}
</style>
