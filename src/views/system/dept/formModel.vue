<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
    width="500px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
        <a-form-item
          v-if="formData.parentId !== 0"
          :label="$t('dept.columns.preDeptName')"
          name="parentId"
          :rules="rulesRef.parentId"
        >
          <a-tree-select
            v-model:value="formData.parentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="$t('selectTips')"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
            :field-names="{
              children: 'children',
              label: 'deptName',
              value: 'deptId'
            }"
            tree-node-filter-prop="deptName"
          />
        </a-form-item>
        <a-form-item :label="$t('dept.columns.deptName')" name="deptName" :rules="rulesRef.deptName">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.deptName" />
        </a-form-item>
        <a-form-item :label="$t('dept.columns.showSort')" name="orderNum" :rules="rulesRef.orderNum">
          <a-input-number v-model:value="formData.orderNum" :min="0" />
        </a-form-item>
        <a-form-item :label="$t('dept.columns.leader')">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.leader" />
        </a-form-item>
        <a-form-item :label="$t('dept.columns.phone')" name="phone" :rules="rulesRef.phone">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.phone" />
        </a-form-item>
        <a-form-item :label="$t('dept.columns.email')">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.email" />
        </a-form-item>

        <a-form-item :label="$t('dept.columns.deptState')">
          <a-radio-group v-model:value="formData.status" name="deptState">
            <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { saveDataProp } from './type'
import { add, edit, listDept, listDeptExcludeChild } from './server'
const emit = defineEmits(['update:show', 'success'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'add'
  },
  curData: {
    type: Object,
    default: () => {}
  },
  sysNormalDisable: {
    type: Array,
    default: () => []
  }
})
const formRef = ref()

const treeData = ref<any[]>([])
const formData = reactive<saveDataProp>({
  deptId: '',
  parentId: undefined,
  deptName: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})
const resetForm = () => {
  formData.deptId = ''
  formData.parentId = undefined
  formData.deptName = ''
  formData.orderNum = 0
  formData.leader = ''
  formData.phone = ''
  formData.email = ''
  formData.status = '0'
}
const rulesRef = reactive({
  parentId: [{ required: true, message: $t('selectTips'), trigger: ['blur', 'change'] }],
  deptName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  orderNum: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.deptId = props.curData.deptId
      formData.parentId = props.curData.parentId
      formData.deptName = props.curData.deptName
      formData.orderNum = props.curData.orderNum
      formData.leader = props.curData.leader
      formData.phone = props.curData.phone
      formData.email = props.curData.email
      formData.status = props.curData.status
      initTreeDtaExcludeChild(props.curData.deptId)
    } else {
      initTreeDtaAll()
    }
  }
})

const initTreeDtaAll = async () => {
  const res: any = await listDept()
  if (res?.code === 200) {
    treeData.value = proxy.handleTree(res.data, 'deptId')
  }
}
const initTreeDtaExcludeChild = async (deptId: string) => {
  const res: any = await listDeptExcludeChild(deptId)
  if (res?.code === 200) {
    treeData.value = proxy.handleTree(res.data, 'deptId')
  }
}
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
const afterClose = () => {
  resetForm()
}

const handleOk = async () => {
  formRef.value
    .validate()
    .then(async () => {
      const params: saveDataProp = {
        parentId: formData.parentId,
        deptName: formData.deptName,
        orderNum: formData.orderNum,
        leader: formData.leader,
        phone: formData.phone,
        email: formData.email,
        status: formData.status
      }
      if (props.status === 'edit') {
        params.deptId = props?.curData?.deptId
        const reponse = await edit(params)
        if (reponse?.code === 200) {
          showValue.value = false
          message.success($t('opeateSuccess'))
          emit('success')
        }
      } else {
        const reponse = await add(params)
        if (reponse?.code === 200) {
          showValue.value = false
          message.success($t('opeateSuccess'))
          emit('success')
        }
      }
    })
    .catch((error: any) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped>
.select-box {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 14px;
  line-height: 1.5714285714285714;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}
</style>
