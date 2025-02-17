<template>
  <div class="search-wrapper">
    <a-card size="small">
      <a-form :model="searchParams" layout="inline">
        <a-form-item label="下拉选分页/模糊检索组件">
          <page-select
            immediate
            style="width: 220px"
            :fieldNames="{
              label: 'name',
              value: 'id'
            }"
            api="logistics/name/dropdown"
            v-model:value="searchParams.logistics_company"
            :placeholder="$t('selectTips')"
          />
        </a-form-item>
        <a-form-item label="表格列自定义组件">
          <fields-setting tabKey="example-components" v-model:value="columnsList" :columns="columns" />
        </a-form-item>
        <a-form-item>
          <div>
            <a-button :loading="loading" type="primary" @click="search"> {{ $t('opts.search') }}</a-button>
            <a-button :loading="loading" class="ml-1" @click="reset">{{ $t('opts.reset') }}</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
  <a-card size="small">
    <div class="mt-1 w100" id="logisticsTable">
      <a-table
        class="ant-table-striped"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        size="small"
        :columns="columnsList"
        :row-key="(record: any) => record.id"
        :data-source="tableData"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ y: 300 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'index'">
            <a>
              {{ (pagination.current - 1) * pagination.pageSize + parseInt(index) + 1 }}
            </a>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
  <a-card class="mt-1" size="small">
    <a-form :model="{}" layout="inline">
      <a-form-item label="数字动画组件">
        <number-animation :to="10000" />
        <number-animation class="ml-2" :from="1000" :to="10000" />
      </a-form-item>
      <a-form-item label="金额格式化组件">
        <Statistic :precision="2" :value="9999999999999" />
      </a-form-item>
    </a-form>
  </a-card>
  <a-card class="mt-1" size="small">
    <span id="typed" />
  </a-card>

  <a-card class="w100 mt-1" size="small">
    <div class="ub w100">
      <div class="shark-wrap shark-card">
        <img src="https://imgservices-1252317822.image.myqcloud.com/coco/b11272023/ececa9a5.7y0amw.jpg" />
      </div>
      <div class="wave-box ml-2">
        <div class="wave" />
      </div>
      <div class="wave-box ml-2">
        <div class="wave" style="--c: #e91e63" />
      </div>
    </div>
  </a-card>

  <a-card class="mt-1" size="small">
    <h1>Server-Sent Events Example</h1>
    <div id="messages" />
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Typed from 'typed.js'
import useTable from '@/hooks/useTable'
const { pagination, loading } = useTable({
  pageSize: 10
})
import { useList } from './hooks/useIndexHooks'
const { columns } = useList()
import { init } from './server'
const tableData = ref<any[]>([])
const columnsList = ref<any[]>([])
const searchParams = reactive({
  logistics_company: undefined
})
const resetForm = () => {
  searchParams.logistics_company = undefined
}
// 初始化
onMounted(() => {
  initData()
  const options = {
    strings: ['我喜欢<span style="color:green">睡觉</span>', '我喜欢吃饭', '<span style="color:red">我喜欢自由</span>'],
    typeSpeed: 100, //打字的速度
    smartBackspace: true, // 开启智能退格 默认false
    backSpeed: 50, //后退速度
    backDelay: 500, //后退延迟
    loop: true, //是否循环.,,
    startDelay: 1000, //起始时间
    fadeOut: true, //淡出效果
    fadeOutClass: 'typed-fade-out', //fadeOutClass 用于淡入淡出动画的css类
    fadeOutDelay: 500 //以毫秒为单位淡出延迟
  }
  new Typed('#typed', options)

  const evtSource = new EventSource(import.meta.env.VITE_IPAPI + 'events')
  const messages: any = document.getElementById('messages')

  evtSource.onmessage = function (event) {
    const newElement = document.createElement('p')
    const eventObject = JSON.parse(event.data)
    newElement.textContent = 'Message:' + eventObject.message + 'at' + eventObject.timestamp
    messages.appendChild(newElement)
  }
})
const initData = async () => {
  loading.value = true
  const params: Pagination & {
    logisticsCompany?: string
  } = {
    logisticsCompany: searchParams.logistics_company,
    pageNum: pagination.current,
    pageSize: pagination.pageSize
  }
  const res: ApiResponseData = await init(params)
  console.log(res, 'res')
  if (res?.code === 0) {
    loading.value = false
    const { total = 0, data = [] } = res
    pagination.total = total
    tableData.value = data
  } else {
    loading.value = false
  }
}
// 搜索
const search = () => {
  pagination.current = 1
  initData()
}

// 重置
const reset = () => {
  pagination.current = 1
  resetForm()
  initData()
}
// 改变页数
const handleTableChange = (page: any) => {
  pagination.current = page.current
  pagination.pageSize = page.pageSize
  initData()
}
</script>

<style lang="scss" scoped>
.shark-card {
  width: 300px;
  border-radius: 8px;
  background-color: #ffe8a3;
  position: relative;
}
.shark-card img {
  display: block;
  width: 100%;
}
.shark-wrap {
  overflow: hidden;
}

.shark-wrap::after {
  content: '';
  position: absolute;
  inset: -20%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 60%);
  animation: shark-wrap 2s infinite;
  transform: translateX(-100%);
}
@keyframes shark-wrap {
  to {
    transform: translateX(100%);
  }
}

.wave-box {
  .wave {
    width: 400px;
    height: 179px;
    outline: 2px dashed gray;
    --c: #2196f3;
    --w1: radial-gradient(100% 57% at top, #0000 100%, var(--c) 100.5%) no-repeat;
    --w2: radial-gradient(100% 57% at bottom, var(--c) 100%, #0000 100.5%) no-repeat;
    background: var(--w1), var(--w2), var(--w1), var(--w2);
    background-position-x:
      -200%,
      -100%,
      0%,
      100%;
    background-position-y: 100%;
    background-size: 50.5% 100%;
    animation: m 1s infinite linear;
  }

  @keyframes m {
    0% {
      background-position-x:
        -200%,
        -100%,
        0%,
        100%;
    }
    100% {
      background-position-x: 0%, 100%, 200%, 300%;
    }
  }
}
</style>
