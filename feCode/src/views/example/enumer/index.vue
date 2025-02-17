<template>
  <a-card size="small">
    <div class="ub ub-ac ub-pj top-opt w100">
      <div>
        <a-button type="primary" @click="showUpload = true">
          <template #icon>
            <ImportOutlined />
          </template>
          {{ $t('opts.import') }}
        </a-button>
        <a-button class="ml-1" type="primary" @click="exportToExcelSelected">
          <template #icon>
            <DownloadOutlined />
          </template>
          {{ $t('opts.exportSelected') }}
        </a-button>
        <a-button class="ml-1" type="primary" @click="exportToExcel">
          <template #icon>
            <DownloadOutlined />
          </template>
          {{ $t('opts.exportAll') }}
        </a-button>
      </div>
      <div>
        <fields-setting tabKey="example-enumer" v-model:value="columnsList" :columns="columns" />
      </div>
    </div>
    <div class="mt-1 w100">
      <a-table
        class="ant-table-striped"
        :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        size="small"
        :columns="columnsList"
        :row-selection="rowSelection('checkbox')"
        :row-key="(record: any) => record.id"
        :data-source="tableData"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ y: scrollY }"
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
  <UploadImport v-model:show="showUpload" @success="successBack" :tempUrl="tempUrl" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { ImportOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import * as XLSX from 'xlsx'
import useTable from '@/hooks/useTable'
import { useList } from './hooks/useDataDic'
const { pagination, scrollY, loading, selectedRows, rowSelection, clearTableSelected } = useTable()
const { columns } = useList()
import { $t } from '@/i18n'
const tempUrl = ref('https://www.flypa.cn/dataTemplate.xlsx')
const columnsList = ref<any[]>([])
const fileName = ref<string>('')
const showUpload = ref<boolean>(false)
const tableData = ref<any[]>([])
const allList = ref<any[]>([])
const successBack = async (obj: any) => {
  clearTableSelected()
  allList.value = obj.list
  fileName.value = obj.fileName
  showUpload.value = false
  initData()
}
const initData = () => {
  loading.value = true
  setTimeout(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    const list = allList.value.slice(startIndex, endIndex)
    const result = {
      total: allList.value.length,
      records: list
    }
    loading.value = false
    const { total, records } = result
    pagination.total = total
    tableData.value = records
  }, 500)
}
// 改变页数
const handleTableChange = (page: any) => {
  pagination.current = page.current
  pagination.pageSize = page.pageSize
  initData()
}
const exportExcelTable = (json: any[], name: string, titleArr: string[], sheetName: string, fields: string[]) => {
  let data = []
  if (!Array.isArray(json)) return console.warn('数据请传入数组')
  if (!Array.isArray(titleArr)) return console.warn('标题请传入数组')
  if (!Array.isArray(fields)) return console.warn('字段请传入数组')
  data = json.map((obj) => {
    return fields.map((field) => {
      return obj[field]
    })
  })
  data.splice(0, 0, titleArr)
  // fields为英文字段表头,一般不需要，需要直接把下面注释打开即可
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  // 此处隐藏英文字段表头
  const wsrows = [{ hidden: false }]
  ws['!rows'] = wsrows // ws - worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  /* generate file and send to client */
  XLSX.writeFile(wb, name + '.xlsx')
}
const exportToExcelSelected = () => {
  if (allList.value.length === 0) {
    message.warning('请先导入数据')
    return
  }
  if (selectedRows.value.length === 0) {
    message.warning('请至少选择一条数据')
    return
  }
  const titleArr = ['名称', '内容'] //表头第一行从左到右
  const fields = ['name', 'content'] //标题对应的字段名
  exportExcelTable(selectedRows.value, fileName.value, titleArr, 'sheetName', fields) //列表变量名、文件名、第一行标题、表名、字段名
}
const exportToExcel = () => {
  if (allList.value.length === 0) {
    message.warning('请先导入数据')
    return
  }
  const titleArr = ['名称', '内容'] //表头第一行从左到右
  const fields = ['name', 'content'] //标题对应的字段名
  exportExcelTable(allList.value, fileName.value, titleArr, 'sheetName', fields) //列表变量名、文件名、第一行标题、表名、字段名
}
</script>

<style lang="scss" scoped></style>
