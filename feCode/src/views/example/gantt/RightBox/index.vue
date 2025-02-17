<template>
  <div class="filter-modal-wrapper">
    <a-drawer
      v-model:open="showValue"
      :title="task.text"
      width="400px"
      placement="right"
      @after-open-change="afterVisibleChange"
    >
      <watermark class="h100">
        <a-form :model="formData" layout="vertical">
          <a-form-item label="进度">
            <a-slider v-model:value="formData.progress" :tip-formatter="formatter" />
            <!-- <a-input style="width: 200px" allowClear :placeholder="$t('inputTips')" v-model:value="formData.progress" /> -->
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              show-search
              :filter-option="filterOption"
              :options="statusList"
              allowClear
              :placeholder="$t('selectTips')"
              v-model:value="formData.status"
            />
          </a-form-item>
          <a-form-item label="指派人">
            <a-select
              show-search
              mode="multiple"
              :filter-option="filterOption"
              :options="usersList"
              allowClear
              :placeholder="$t('selectTips')"
              v-model:value="formData.users"
            />
          </a-form-item>
        </a-form>
        <div class="ub w100 ub-ac ub-pc opts">
          <a-button class="mr-3" @click="cancel">{{ $t('opts.cancel') }}</a-button>
          <a-button type="primary" @click="handleOk"> {{ $t('opts.sure') }}</a-button>
        </div>
      </watermark>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref } from 'vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import { $t } from '@/i18n'
const emit = defineEmits(['update:show', 'success'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    require: true,
    type: Object,
    default: () => {}
  }
})
const formatter = (value: number) => {
  return `${value}%`
}
const formData = reactive({
  progress: 0,
  status: undefined,
  users: []
})
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
const statusList = ref<any[]>([
  { value: 0, label: '正常' },
  { value: 1, label: '未开始' },
  { value: 2, label: '已完成' },
  { value: 3, label: '进行中' },
  { value: 4, label: '逾期' }
])
const usersList = ref<any[]>([
  { value: 1, label: '张三' },
  { value: 2, label: '李四' },
  { value: 3, label: '王五' },
  { value: 4, label: '赫六' }
])

watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      resetForm()
    } else {
      formData.progress = props.task.progress * 100
      formData.status = props.task?.status ?? undefined
      formData.users = props.task?.users ? props.task.users.map((item: any) => item.value) : []
    }
  }
)
const resetForm = () => {
  formData.progress = 0
  formData.status = undefined
  formData.users = []
}
const cancel = () => {
  emit('update:show', false)
  resetForm()
}
const handleOk = () => {
  const data: any = {}
  data.progress = formData.progress / 100
  data.status = formData.status
  data.users = formData.users.map((item) => {
    return {
      value: item,
      label: usersList.value.find((user: any) => user.value === item)?.label
    }
  })
  emit('success', data)
  emit('update:show', false)
}
const afterVisibleChange = (val: boolean) => {
  if (!val) {
    formData.progress = 0
    formData.status = undefined
    formData.users = []
  }
}

defineExpose({
  resetForm
})
</script>

<style lang="scss" scoped>
.opts {
  position: absolute;
  left: 0;
  bottom: 30px;
  height: 50px;
}
</style>
