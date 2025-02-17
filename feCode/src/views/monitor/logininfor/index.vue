<template>
  <div class="search-wrapper">
    <a-card size="small">
      <a-form :model="searchParams" layout="inline">
        <a-form-item :label="$t('logininfo.columns.address')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.ipaddr"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('logininfo.columns.userName')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.userName"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('logininfo.columns.state')">
          <a-select
            show-search
            :filter-option="filterOption"
            :options="sys_common_status"
            allowClear
            :placeholder="$t('selectTips')"
            style="width: 220px"
            v-model:value="searchParams.status"
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
      <a-popconfirm
        :title="$t('sureTips')"
        :ok-text="$t('opts.sure')"
        :cancel-text="$t('opts.cancel')"
        @confirm="toEmpty"
      >
        <a-button size="small" type="primary" danger>
          <template #icon>
            <DeleteOutlined />
          </template>
          {{ $t('opts.empty') }}
        </a-button>
      </a-popconfirm>

      <a-button class="ml-1" :disabled="selectedRowKeys.length === 0" size="small" danger @click="toDelete">
        <template #icon>
          <DeleteOutlined />
        </template>
        {{ $t('opts.delete') }}
      </a-button>
    </div>
    <div>
      <a-button type="link" ref="ref2" shape="circle">
        <fields-setting tabKey="logininfor-table" v-model:value="columnsList" :columns="columns" />
      </a-button>
    </div>
  </div>
  <a-card size="small">
    <div class="mt-1 w100" id="logininforTable">
      <a-table
        class="ant-table-striped"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        size="small"
        :columns="columnsList"
        :row-key="(record: any) => record.infoId"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection('checkbox')"
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
          <template v-if="column.dataIndex === 'status'">
            <dict-tag :options="sys_common_status" :value="record.status" />
          </template>
          <template v-if="column.dataIndex === 'loginTime'">
            <span>{{ timeFormat(record.loginTime) }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { timeFormat } from '@/utils/tools'
const { proxy } = getCurrentInstance() as any
const { sys_common_status } = proxy.useDict('sys_common_status')
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import useTable from '@/hooks/useTable'
const { pagination, loading, scrollY, selectedRowKeys, rowSelection } = useTable()

import { message } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { useList } from './hooks/useIndexHooks'
const { columns } = useList()
import { init, emptyAll, deleteItem } from './server'
import { $t } from '@/i18n'
const tableData = ref<any[]>([])
const columnsList = ref<any[]>([])
const searchParams = reactive({
  ipaddr: '',
  userName: '',
  status: undefined
})
const resetForm = () => {
  searchParams.ipaddr = ''
  searchParams.userName = ''
  searchParams.status = undefined
}
// 初始化
onMounted(() => {
  initData()
})
const toDelete = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const ids = selectedRowKeys.value.join(',')
    const res: ApiResponseData = await deleteItem(ids)
    if (res?.code === 200) {
      selectedRowKeys.value = []
      message.success($t('opeateSuccess'))
      initData()
    }
    resolve(true)
  })
}
const toEmpty = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const res: ApiResponseData = await emptyAll()
    if (res?.code === 200) {
      selectedRowKeys.value = []
      message.success($t('opeateSuccess'))
      initData()
    }
    resolve(true)
  })
}
const initData = async () => {
  loading.value = true
  const params: Pagination & {
    ipaddr?: string
    userName?: string
    status?: number
  } = {
    ipaddr: searchParams.ipaddr,
    userName: searchParams.userName,
    status: searchParams.status,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    orderByColumn: 'login_time',
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
