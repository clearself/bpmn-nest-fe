<template>
  <div class="search-wrapper">
    <a-card size="small">
      <a-form :model="searchParams" layout="inline">
        <a-form-item :label="$t('user.columns.userName')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.userName"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('user.columns.phonenumber')">
          <a-input
            allowClear
            v-model:value.trim="searchParams.phonenumber"
            :placeholder="$t('inputTips')"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item :label="$t('user.columns.deptName')">
          <a-tree-select
            v-model:value="searchParams.deptId"
            :placeholder="$t('selectTips')"
            :tree-data="deptOptions"
            show-search
            allow-clear
            tree-default-expand-all
            style="width: 220px"
            tree-node-filter-prop="label"
            :fieldNames="{ label: 'label', value: 'id', children: 'children' }"
          />
        </a-form-item>
        <a-form-item :label="$t('user.columns.state')">
          <a-select
            show-search
            :filter-option="filterOption"
            :options="sys_normal_disable"
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
      <a-button size="small" type="primary" @click="showAddBox">
        <template #icon>
          <PlusOutlined />
        </template>
        {{ $t('opts.add') }}
      </a-button>
    </div>
    <div>
      <a-button type="link" ref="ref2" shape="circle">
        <fields-setting tabKey="user-table" v-model:value="columnsList" :columns="columns" />
      </a-button>
    </div>
  </div>
  <a-card size="small">
    <div class="mt-1 w100" id="userTable">
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
          <template v-if="column.dataIndex === 'deptName'">
            <span>{{ record.dept.deptName }}</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <dict-tag :options="sys_normal_disable" :value="record.status" />
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ timeFormat(record.createTime) }}</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button
              type="link"
              size="small"
              v-if="record.userId !== 1 && record.userId !== 104"
              @click="showEditBox(record)"
              >{{ $t('opts.edit') }}</a-button
            >
            <a-button
              type="link"
              size="small"
              v-if="record.userId !== 1 && record.userId !== 104"
              @click="changePassword(record)"
              >{{ $t('opts.changePassword') }}</a-button
            >
            <a-popconfirm
              :title="$t('sureTips')"
              :ok-text="$t('opts.sure')"
              :cancel-text="$t('opts.cancel')"
              @confirm="toDelete(record)"
            >
              <a-button type="link" size="small" v-if="record.userId !== 1 && record.userId !== 104" danger>{{
                $t('opts.delete')
              }}</a-button>
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
    :sysNormalDisable="sys_normal_disable"
    :sysUserSex="sys_user_sex"
    :deptOptions="deptOptions"
    @success="onSuccess"
  />

  <password-model v-model:show="formPasswordShow" :cur-data="curData" @success="onSuccess" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { timeFormat } from '@/utils/tools'
const { proxy } = getCurrentInstance() as any
const { sys_normal_disable, sys_user_sex } = proxy.useDict('sys_normal_disable', 'sys_user_sex')
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import useTable from '@/hooks/useTable'
const { pagination, loading, scrollY } = useTable()

import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import FormModel from './formModel.vue'
import PasswordModel from './passwordModel.vue'
import { useList } from './hooks/useIndexHooks'
const { columns } = useList()
import { init, deleteItem, deptTreeSelect, getUser } from './server'
import { $t } from '@/i18n'

const formPasswordShow = ref<boolean>(false)
const formShow = ref<boolean>(false)
const statusAdd = ref<string>('add')
const tableData = ref<any[]>([])
const deptOptions = ref<any[]>([])
const columnsList = ref<any[]>([])
let curData = reactive({})
const searchParams = reactive({
  userName: '',
  deptId: undefined,
  phonenumber: '',
  status: undefined
})
const resetForm = () => {
  searchParams.userName = ''
  searchParams.deptId = undefined
  searchParams.phonenumber = ''
  searchParams.status = undefined
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
    const res: ApiResponseData = await deleteItem({ id: record.userId })
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
const showEditBox = async (record: any) => {
  const res = await getUser(record.userId)
  if (res?.code === 200) {
    console.log(res, 'user')
    const response = res.data
    curData = response.data
    statusAdd.value = 'edit'
    formShow.value = true
  }
}
const changePassword = async (record: any) => {
  curData = record
  formPasswordShow.value = true
}

const initDeptTreeData = async () => {
  const res = await deptTreeSelect()
  console.log(res, 'dept')
  if (res?.code === 200) {
    deptOptions.value = res.data
  }
}
initDeptTreeData()
const initData = async () => {
  loading.value = true
  const params: Pagination & {
    userName?: string
    deptId?: string
    phonenumber?: string
    status?: number
  } = {
    userName: searchParams.userName,
    deptId: searchParams.deptId,
    phonenumber: searchParams.phonenumber,
    status: searchParams.status,
    pageNum: pagination.current,
    pageSize: pagination.pageSize
    // orderByColumn: 'create_time',
    // isAsc: 'descending'
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
