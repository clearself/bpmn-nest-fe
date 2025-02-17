<script setup lang="ts">
import { onMounted, computed, ref, h, watchEffect } from 'vue'
import { $t } from '@/i18n'
import draggable from 'vuedraggable'
import { SettingOutlined } from '@ant-design/icons-vue'
const emit = defineEmits(['update:value', 'changeState'])
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  // tabKey 表格全系统唯一标识建议用一级菜单名+二级菜单名等依次类推
  tabKey: {
    type: String,
    default: ''
  },
  // 全部字段
  columns: {
    type: Array,
    default: () => []
  },
  // 过滤无操作字段
  filter: {
    type: Array,
    default: () => []
  }
})
// 过滤出固定的列不参与自定义设置
const fixedCols = props.columns.filter((item: any) => item.fixed)
const _filters: string[] = fixedCols.map((item: any) => item.dataIndex)
const checkList = ref<string[]>([])
const allList = ref<colPro[]>([])
const disabledData = computed(() => {
  return [..._filters, ...props.filter]
})
// 全部数据处理
const initAllList = () => {
  const cacheData = localStorage.getItem(props.tabKey)
  if (cacheData) {
    const _cacheData = JSON.parse(cacheData)
    return _cacheData
  } else {
    return props.columns.map((item: any) => {
      item.checked = true
      return item
    })
  }
}
// 选中数据处理
const initList = () => {
  const cacheData = localStorage.getItem(props.tabKey)
  if (cacheData) {
    const _cacheData = JSON.parse(cacheData)
    return _cacheData.map((item: any) => item.checked && item.dataIndex)
  } else {
    return props.columns.map((item: any) => item.dataIndex)
  }
}

onMounted(() => {
  // 表头初始化及表头显示处理
  allList.value = initAllList()
  checkList.value = initList()
})
// 监听allList变化 筛选出排序后并且被选中的数据双向绑定出去
watchEffect(() => {
  const list: colPro[] = allList.value.filter((item) => item.checked)
  const _list: colPro[] = list.map((item: colPro) => {
    item.title = $t(item.lang)
    return item
  })
  emit('update:value', _list)
})
// 排序处理
const onEnd = () => {
  localStorage.setItem(props.tabKey, JSON.stringify(allList.value))
}
// 选中处理
const changeHeader = () => {
  const _allList = allList.value.map((item) => {
    if (checkList.value.includes(item.dataIndex)) {
      item.checked = true
    } else {
      if (disabledData.value.includes(item.dataIndex)) {
        item.checked = true
      } else {
        item.checked = false
      }
    }
    return item
  })
  localStorage.setItem(props.tabKey, JSON.stringify(_allList))
}
const reset = () => {
  localStorage.removeItem(props.tabKey)
  allList.value = initAllList()
  checkList.value = initList()
}
</script>
<template>
  <a-dropdown>
    <a-button size="small" shape="circle" :icon="h(SettingOutlined)" />
    <template #overlay>
      <a-menu>
        <div class="left-tip my-1 pl-1">
          <span>{{ $t('dragOrder') }}</span>
          <a-button type="link" size="small" @click="reset">{{ $t('opts.reset') }}</a-button>
        </div>
        <a-checkbox-group v-model:value="checkList" @change="changeHeader">
          <draggable
            tag="div"
            :item-key="(key: any) => key.dataIndex"
            class="pb-1"
            :list="allList"
            animation="300"
            @end="onEnd"
          >
            <template #item="{ element }">
              <div class="pl-1">
                <a-checkbox v-if="!disabledData.includes(element.dataIndex)" :value="element.dataIndex">{{
                  $t(element.lang)
                }}</a-checkbox>
              </div>
            </template>
          </draggable>
        </a-checkbox-group>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style lang="scss" scoped></style>
