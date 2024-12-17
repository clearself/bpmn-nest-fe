<template>
  <div class="search-wrapper">
    <a-card size="small">
      <a-form :model="searchParams" layout="inline">
        <a-form-item :label="$t('example.table.logisticsCompanyName')">
          <page-select
            ref="ref1"
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
        <a-form-item :label="$t('example.table.logisticsMethods')">
          <a-input
            allowClear
            v-model:value="searchParams.logistics_method"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('example.table.logisticsTrackingNumber')">
          <a-input
            allowClear
            v-model:value="searchParams.logistics_number"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('example.table.deliveryNo')">
          <a-input
            allowClear
            v-model:value="searchParams.tracking_no"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('example.table.contacts')">
          <a-input
            allowClear
            v-model:value="searchParams.contacts"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('example.table.contactInformation')">
          <a-input
            allowClear
            v-model:value="searchParams.contact_phone"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('example.table.licensePlateNumber')">
          <a-input
            allowClear
            v-model:value="searchParams.license_plate_number"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
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
  <div class="ub ub-ac ub-pj top-opt w100">
    <div>
      <a-button size="small" type="primary" @click="showAddBox">
        <template #icon>
          <PlusOutlined />
        </template>
        {{ $t('opts.add') }}
      </a-button>
      <a-button class="ml-2" ref="ref3" size="small" type="primary" @click="toViewDocs(2)">
        查看 useTable hooks 封装
      </a-button>
    </div>
    <div>
      <a-button type="link" ref="ref2" shape="circle">
        <fields-setting tabKey="example-table" v-model:value="columnsList" :columns="columns" />
      </a-button>
    </div>
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
        :scroll="{ y: scrollY }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">
            <a>
              {{ (pagination.current - 1) * pagination.pageSize + parseInt(index) + 1 }}
            </a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" size="small" @click="showEditBox(record)">{{ $t('opts.edit') }}</a-button>
            <a-popconfirm
              :title="$t('sureTips')"
              :ok-text="$t('opts.sure')"
              :cancel-text="$t('opts.cancel')"
              @confirm="toDelete(record)"
            >
              <a-button type="link" size="small" danger>{{ $t('opts.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
  <form-model v-model:show="formShow" :status="statusAdd" :cur-data="curData" @success="onSuccess" />
  <a-tour v-model:current="current" :open="open" :steps="steps" @close="handleOpen">
    <template #indicatorsRender="{ current, total }">
      <div class="ub w100 ub-pj ub-ac">
        <div>
          <span>{{ current + 1 }} / {{ total }}</span>
        </div>
        <div class="ml-2"><a-button type="primary" size="small" @click="toViewDocs(current)">查看文档</a-button></div>
      </div>
    </template>
  </a-tour>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { TourProps } from 'ant-design-vue'
// import userFilterOption from '@/hooks/userFilterOption'
// const { filterOption } = userFilterOption()
import useTable from '@/hooks/useTable'
const { pagination, loading, scrollY } = useTable()

import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import FormModel from './formModel.vue'
import { useList } from './hooks/useIndexHooks'
const { columns } = useList()
import { init, deleteItem } from './server'
import { $t } from '@/i18n'
const ref1 = ref(null)
const ref2 = ref(null)
const ref3 = ref(null)
const current = ref(0)
const formShow = ref<boolean>(false)
const open = ref<boolean>(true)
const statusAdd = ref<string>('add')
const tableData = ref<any[]>([])
const columnsList = ref<any[]>([])
let curData = reactive({})
const searchParams = reactive({
  logistics_company: undefined,
  logistics_method: '',
  logistics_number: '',
  tracking_no: '',
  contacts: '',
  contact_phone: '',
  license_plate_number: ''
})
const resetForm = () => {
  searchParams.logistics_company = undefined
  searchParams.logistics_method = ''
  searchParams.logistics_number = ''
  searchParams.tracking_no = ''
  searchParams.contacts = ''
  searchParams.contact_phone = ''
  searchParams.license_plate_number = ''
}
const steps: TourProps['steps'] = [
  {
    title: '数据下拉分页组件 page-select',
    description: '支持远程模糊搜索并支持分页检索',
    target: () => ref1.value && ref1.value.$el,
    docsUrl: 'https://www.flypa.cn/vue-super-ui/docs/fe/vue/page-select.html'
  },
  {
    title: '表格列自定义组件 fields-setting',
    description: '支持表格列自定义显示/隐藏且可拖动自定义排序，设置可保持记忆，一键重置功能。',
    target: () => ref2.value && ref2.value.$el,
    docsUrl: 'https://www.flypa.cn/vue-super-ui/docs/fe/vue/fields-setting.html'
  },
  {
    title: 'useTable hooks 封装',
    description: '增强表格的各种应用场景使用，提高工作效率。',
    target: () => ref3.value && ref3.value.$el,
    docsUrl: 'https://www.flypa.cn/vue-super-ui/docs/fe/vue/useTable.html'
  }
]
const toViewDocs = (index: number) => {
  window.open(steps[index].docsUrl, '_blank')
}
const handleOpen = (): void => {
  open.value = false
}
// 初始化
onMounted(() => {
  console.log(ref2.value, 'ref2.value')
  initData()
})

const onSuccess = () => {
  // 添加/编辑成功后刷新一下当前数据
  initData()
}
const toDelete = (record: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const res: ApiResponseData = await deleteItem({ id: record.id })
    if (res?.code === 0) {
      message.success($t('opeateSuccess'))
      initData()
    }
    resolve(true)
  })
}
const showAddBox = () => {
  statusAdd.value = 'add'
  formShow.value = true
}
const showEditBox = (record: any) => {
  curData = record
  statusAdd.value = 'edit'
  formShow.value = true
}
const initData = async () => {
  loading.value = true
  const params: Pagination & {
    logisticsCompany?: string
    logisticsMethod?: string
    logisticsNumber?: string
    trackingNo?: string
    contacts?: string
    contactPhone?: string
    licensePlateNumber?: string
  } = {
    logisticsCompany: searchParams.logistics_company,
    logisticsMethod: searchParams.logistics_method,
    logisticsNumber: searchParams.logistics_number,
    trackingNo: searchParams.tracking_no,
    contacts: searchParams.contacts,
    contactPhone: searchParams.contact_phone,
    licensePlateNumber: searchParams.license_plate_number,
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

<style lang="scss" scoped></style>
