import { ref, toRefs, reactive, onMounted, computed, nextTick } from 'vue'
// 国际化
import { $t } from '@/i18n'
// 防抖
import { debounce } from 'lodash-es'
import { getTableScroll } from '@/utils/tools'
/*
  options  object属性 根据需求添加参数 目前有以下参数：
  @params pageSize number类型，自定义表格每页显示条数
  @params showSizeChanger boolean类型，自定义控制是否展示每页多少条的下拉空间
  @params showQuickJumper boolean类型，自定义控制是否展示跳转空间
  @params pageSizeOptions array类型，自定义表格size下拉选项
  @params disabledField string类型，可选中表格时不可选中的判断字段名称 该字段的值必须是true或者false
  @params tableKey string类型，表格全系统唯一标识
  @params extraHeight number类型，表格底部留白的额外高度
  @params delay number类型，表格随窗口变化高度重新计算的延迟时间毫秒
  用法示例：usetable({})作为参数传入
*/
export default function useTable(options?: Record<string, any>) {
  const loading = ref<boolean>(false)
  const scrollY: any = ref('')
  const dataObj = reactive({
    selectedRowKeys: <any>[],
    selectedRows: <any>[]
  })
  const pagination = reactive({
    current: 1,
    pageSize: options?.pageSize ?? 30,
    showSizeChanger: options?.showSizeChanger ?? true, // 用于控制展示每页多少条的下拉
    showQuickJumper: options?.showQuickJumper ?? false,
    total: 0,
    pageSizeOptions: options?.pageSizeOptions ?? ['10', '20', '30', '40', '50', '100'],
    showTotal: (total: number) => `${$t('total')} ${total} ${$t('pieces')}`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange
  })
  // 页数改变的方法
  function pageSizeChange(_val: number, pageNum: number) {
    pagination.pageSize = pageNum // 修改每页显示的条数
    pagination.current = 1
  }
  // 点击上一页下一页的方法
  function pageChange(page: number) {
    pagination.current = page
  }
  // 选中处理
  const rowSelection = computed(() => (type: string = 'radio') => {
    const { selectedRowKeys } = dataObj
    return {
      preserveSelectedRowKeys: true, // 跨页选中
      type: type,
      columnWidth: 80,
      columnTitle: type === 'radio' ? $t('columns.selection') : '',
      selectedRowKeys, // 取消选中（必须加上不然无效）
      onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
        dataObj.selectedRowKeys = selectedRowKeys
        dataObj.selectedRows = selectedRows
      },
      getCheckboxProps: (record: any) => {
        // disabledField接搜不可选中字段
        if (options?.disabledField) {
          return {
            disabled: record[options.disabledField]
          }
        }
        return {
          disabled: false
        }
      }
    }
  })
  // 取消表格选中方法
  const clearTableSelected = () => {
    dataObj.selectedRowKeys = []
    dataObj.selectedRows = []
  }
  onMounted(() => {
    nextTick(() => {
      const offsetBottom = getTableScroll(options?.extraHeight ?? 0, options?.tableKey ?? '').offsetBottom
      scrollY.value =
        offsetBottom <= 300 ? 300 : getTableScroll(options?.extraHeight ?? 0, options?.tableKey ?? '').height
      window.onresize = debounce(() => {
        scrollY.value = getTableScroll(options?.extraHeight ?? 0, options?.tableKey ?? '').height
      }, options?.delay ?? 50)
    })
  })

  return {
    ...toRefs(dataObj),
    pagination,
    loading,
    scrollY,
    rowSelection,
    clearTableSelected
  }
}
