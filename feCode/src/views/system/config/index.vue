<template>
  <div class="search-wrapper">
    <a-card size="small">
      <a-form :model="searchParams" layout="inline">
        <a-form-item :label="$t('config.columns.configName')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.configName"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('config.columns.configKey')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.configKey"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('config.columns.configType')">
          <a-select
            show-search
            :filter-option="filterOption"
            :options="sys_yes_no"
            allowClear
            :placeholder="$t('selectTips')"
            style="width: 220px"
            v-model:value="searchParams.configType"
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
    </div>
    <div>
      <a-button type="link" ref="ref2" shape="circle">
        <fields-setting tabKey="config-table" v-model:value="columnsList" :columns="columns" />
      </a-button>
    </div>
  </div>
  <a-card size="small">
    <div class="mt-1 w100" id="configTable">
      <a-table
        class="ant-table-striped"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        size="small"
        :columns="columnsList"
        :row-key="(record: any) => record.deptId"
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
          <template v-if="column.dataIndex === 'configType'">
            <dict-tag :options="sys_yes_no" :value="record.configType" />
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ timeFormat(record.createTime) }}</span>
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
  <form-model
    v-model:show="formShow"
    :status="statusAdd"
    :cur-data="curData"
    :sysYesNo="sys_yes_no"
    @success="onSuccess"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { timeFormat } from '@/utils/tools'
const { proxy } = getCurrentInstance() as any
const { sys_yes_no } = proxy.useDict('sys_yes_no')
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import useTable from '@/hooks/useTable'
const { pagination, loading, scrollY } = useTable()

import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import FormModel from './formModel.vue'
import { useList } from './hooks/useIndexHooks'
const { columns } = useList()
import { init, deleteItem } from './server'
import { $t } from '@/i18n'
const formShow = ref<boolean>(false)
const statusAdd = ref<string>('add')
const tableData = ref<any[]>([])
const columnsList = ref<any[]>([])
let curData = reactive({})
const searchParams = reactive({
  configName: '',
  configKey: '',
  configType: undefined
})
const resetForm = () => {
  searchParams.configName = ''
  searchParams.configKey = ''
  searchParams.configType = undefined
}
// 初始化
onMounted(() => {
  initData()
})

const onSuccess = () => {
  // 添加/编辑成功后刷新一下当前数据
  initData()
}
const toDelete = (record: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const res: ApiResponseData = await deleteItem({ id: record.configId })
    if (res?.code === 200) {
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
    configName?: string
    configKey?: string
    configType?: number
  } = {
    configName: searchParams.configName,
    configKey: searchParams.configKey,
    configType: searchParams.configType,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    orderByColumn: 'create_time',
    isAsc: 'descending'
  }
  const res: ApiResponseData = await init(params)
  console.log(res, 'res')
  if (res?.code === 200) {
    loading.value = false
    const { total = 0, list = [] } = res.data
    pagination.total = total
    tableData.value = list
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
