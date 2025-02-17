<template>
  <div class="modal-wrapper" ref="mymodal">
    <a-modal :getContainer="() => $refs.mymodal" v-model:open="showValue" width="600px" :footer="null">
      <template #title>
        <div class="ub w100 ub-ac">
          <div>{{ title }}</div>
          <div class="ml-2">
            <a-button size="small" @click="downFile">
              <template #icon>
                <DownloadOutlined />
              </template>
              {{ $t('uploadInfo.downloadTemp') }}
            </a-button>
          </div>
        </div>
      </template>
      <div class="mt-1 w100 upload-box">
        <a-upload-dragger
          :showUploadList="false"
          :max-count="10"
          accept="*"
          :before-upload="beforeUpload"
          :customRequest="customRequest"
        >
          <p class="ant-upload-drag-icon">
            <plus-outlined />
          </p>
          <p class="ant-upload-text">
            {{ $t('uploadInfo.method') }}
          </p>
          <p class="ant-upload-hint">
            {{ $t('uploadInfo.tip1') }}
          </p>
        </a-upload-dragger>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as XLSX from 'xlsx'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { handleDownLoadByUrl } from '@/utils/tools'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash-es'
import { $t } from '@/i18n'
const emit = defineEmits(['update:show', 'success'])

const props = withDefaults(
  defineProps<{
    title?: string
    show: boolean
    url?: string
    tempUrl?: string
    callbackSuccess?: (key?: string) => void
  }>(),
  {
    title: '',
    show: false,
    url: '',
    tempUrl: ''
  }
)
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
const downFile = async () => {
  handleDownLoadByUrl(props.tempUrl)
}
const isAcceptFile = (file: any) => {
  if (file) {
    const fileExtension = file.name.indexOf('.') > -1 ? file.name.split('.').pop() : ''
    return fileExtension === 'xlsx' || fileExtension === 'xl'
  }
  return false
}
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  return new Promise((resolve, reject) => {
    if (isAcceptFile(file)) {
      if (file.size > 200 * 1024 * 1024) {
        message.info($t('uploadInfo.size'))
        reject('size_exceeded')
      } else {
        resolve(true)
      }
    } else {
      message.info($t('uploadInfo.type'))
    }
  })
}
const mapping = {
  name: '名称',
  content: '内容',
  num: '数量'
}
const formatData = (list: any) => {
  let arr = []
  const _list = cloneDeep(list || [])
  arr = _list.map((item: any) => ({
    name: item[mapping.name],
    content: item[mapping.content],
    num: item[mapping.num]
  }))
  return arr
}
const handelData = (list: any) => {
  let arr = <any>[]
  const _list = cloneDeep(list || [])
  _list.forEach((item: any) => {
    const _arr = []
    if (item.num > 0) {
      for (let i = 0; i < item.num; i++) {
        _arr.push({
          id: uuidv4(),
          name: item.name,
          content: item.content
        })
      }
    }
    arr = arr.concat(_arr)
  })
  return arr
}
const customRequest = (option: any) => {
  const { file }: { file: File } = option
  console.log(file, 'filefilefilefilefilefile')
  const reader = new FileReader()
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    const list = formatData(jsonData)
    const result = handelData(list)
    console.log(result, 'result')
    let names = file.name.split('.')
    names.pop()
    emit('success', {
      list: result,
      fileName: names.join('.')
    })
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style lang="scss" scoped></style>
