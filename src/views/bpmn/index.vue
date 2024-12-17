<template>
  <div class="bpmn-box">
    <BpmnModal
      :processId="processId"
      :processName="processName"
      prefix="camunda"
      :users="users"
      :roles="roles"
      @result="result"
    />
  </div>
  <a-modal :title="'流程ID:Process_' + processId" v-model:open="xmlVisible" width="90%" @ok="handleOk">
    <v-ace-editor v-model:value="xmlView" lang="xml" theme="chrome" :options="editorOptions" class="vue-ace-editor" />
  </a-modal>
</template>
<script setup lang="ts">
import BpmnModal from '@/packages/ProcessDesigner/index.vue'
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import '@/config/aceConfig.js'
import type { Ace } from 'ace-builds'
const processId = ref('213413455342')
const processName = ref('测试流程')
const xmlVisible = ref<boolean>(false)

const xmlView = ref<string>('')
const editorOptions: Partial<Ace.EditorOptions> = reactive({
  useWorker: true, // 启用语法检查,必须为true
  enableBasicAutocompletion: true, // 自动补全
  enableLiveAutocompletion: true, // 智能补全
  enableSnippets: true, // 启用代码段
  showPrintMargin: false, // 去掉灰色的线，printMarginColumn
  highlightActiveLine: false, // 高亮行
  highlightSelectedWord: true, // 高亮选中的字符
  tabSize: 4, // tab锁进字符
  fontSize: 14, // 设置字号
  wrap: false, // 是否换行
  readOnly: true, // 是否可编辑
  minLines: 1, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
  maxLines: 50 // 最大行数
})
const result = (result: any) => {
  console.log(result, 'resultresultresult')
  xmlView.value = result.xml
  xmlVisible.value = true
}

const users = ref([
  {
    value: '1',
    label: '小明'
  },
  {
    value: '2',
    label: '小红'
  },
  {
    value: '3',
    label: '李生'
  }
])
const roles = ref([
  {
    value: '1',
    label: '项目经理'
  },
  {
    value: '2',
    label: '财务'
  },
  {
    value: '3',
    label: '客服'
  }
])
const handleOk = () => {
  message.info('请调用保存接口将流程ID和生成的xml传给后端！')
}
</script>

<style lang="scss">
.bpmn-box {
  width: 100vw;
  height: 100vh;
}
</style>
