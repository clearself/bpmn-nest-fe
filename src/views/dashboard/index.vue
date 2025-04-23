<template>
  <!-- <div>待开发中...</div> -->
  <!-- <a-upload
    v-model:file-list="fileList"
    name="file"
    :headers="headers"
    action="/api/common/upload"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined />
      Click to Upload
    </a-button>
  </a-upload> -->
  <span>将网页转化成pdf导出：</span>
  <a-input style="width: 500px" allowClear placeholder="请输入网页url" v-model:value.trim="mdStr" />
  <a-button style="margin-left: 10px" :loading="exporting" class="mt-2" @click="exportPdf"> 导出网页PDF </a-button>
  <!-- <a-input v-model:value="textVal" @input="onInput1" />
  <a-button @click="reportSuperData">
    <upload-outlined />
    上报
  </a-button> -->
  <!-- <Editor @onInput="onInput" /> -->
  <!-- <div class="w100 ub" style="height: 800px">
    <div class="ub ub-f1" style="height: 100%">
      <RichEidtor v-model:value="richHtml" />
    </div>

    <div class="ub ub-f1 ml-2 editor-content-view" style="height: 100%">
      <div class="w100 px-1" id="editor-content-view" v-html="richHtml" />
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { watch, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import RichEidtor from './RichEidtor.vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import Editor from './eidtor.vue'
import { getToken } from '@/utils/auth'
import { exportPdfFile, reportSuper } from './server'
import { downloadpdf } from '@/utils/tools'
const token = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
const mdStr = ref('')
const richHtml = ref('')
const textVal = ref('')
function groupStringEveryFive(str) {
  const result = []
  for (let i = 0; i < str.length; i += 5) {
    result.push(str.substr(i, 5))
  }
  return result
}
const handelInputVal = (str) => {
  if (!str) return ''
  const _str = groupStringEveryFive(str)
  return _str.join('-')
}
const onInput1 = (e: any) => {
  console.log(e.target.value, 111)
  const str = e.target.value.replace(/-/g, '')
  const res = handelInputVal(str)
  textVal.value = res
}
const reportSuperData = async () => {
  const res = await reportSuper({
    path: '/docs/fe/html/standard2.html',
    url: 'https://www.flypa.cn/vue-super-ui/docs/fe/html/standard2.html'
  })
  console.log(res, '11111111111111111')
}
watch(
  () => richHtml.value,
  (newVal) => {
    console.log(newVal, 'newVal')
  }
)
const headers = ref({
  Authorization: token ? 'Bearer ' + token : undefined
})
interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
const exporting = ref(false)
const fileList = ref([])
const handleChange = (info: FileInfo) => {
  if (info.file.status !== 'uploading') {
    console.log(info, 'uploading')
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    console.log(info, 'done')
    if (info.file.response.code === 200) {
      message.success(`${info.file.name} file uploaded successfully`)
    } else {
      message.error(`${info.file.name} file uploaded fail ${info.file.response.msg}`)
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const onInput = (text: string) => {
  mdStr.value = text
}
const exportPdf = async () => {
  if (!mdStr.value) {
    message.error(`请输入网址`)
    return
  }
  exporting.value = true
  message.success(`导出中...`)
  const res: any = await exportPdfFile(mdStr.value)

  message.success(`导出成功！`)
  exporting.value = false
  downloadpdf(res, '测试', 'pdf')
  console.log(res, 'export')
}
</script>
<style lang="scss">
@import 'rich.scss';
.editor-content-view a {
  color: red;
  text-decoration: none;
  margin-right: 5px;
}
</style>
