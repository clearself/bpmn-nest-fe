<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    title="分配数据权限"
    width="500px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
        <a-form-item :label="$t('role.columns.roleName')" name="roleName" :rules="rulesRef.roleName">
          <a-input disabled allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.roleName" />
        </a-form-item>
        <a-form-item :label="$t('role.columns.roleKey')" name="roleKey" :rules="rulesRef.roleKey">
          <a-input disabled allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.roleKey" />
        </a-form-item>
        <a-form-item :label="$t('role.columns.dataScope')">
          <a-select
            show-search
            :filter-option="filterOption"
            :options="dataScopeOptions"
            allowClear
            :placeholder="$t('selectTips')"
            style="width: 100%"
            v-model:value="formData.dataScope"
            @change="dataScopeSelectChange"
          />
        </a-form-item>
        <a-form-item :label="$t('role.columns.menuPermission')" v-show="formData.dataScope == 2">
          <a-checkbox v-model:checked="menuExpand" @change="handleCheckedTreeExpand">展开/折叠</a-checkbox>
          <a-checkbox v-model:checked="menuNodeAll" @change="handleCheckedTreeNodeAll">全选/全不选</a-checkbox>
          <!-- <a-checkbox v-model:checked="formData.deptCheckStrictly" @change="handleCheckedTreeConnect"
          >父子联动</a-checkbox
        > -->
          <a-tree
            class="tree-border"
            v-model:expandedKeys="expandedKeys"
            v-model:checkedKeys="checkedKeys"
            :tree-data="menuOptions"
            checkable
            @check="onCheck"
            :check-strictly="!formData.deptCheckStrictly"
            :fieldNames="{ title: 'label', key: 'id', children: 'children' }"
          />
        </a-form-item>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import { $t } from '@/i18n'
import { flatten } from '@/utils/tools'
import { saveDataProp } from './type'
import { dataScope, deptTreeSelect } from './server'
const emit = defineEmits(['update:show', 'success'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  curData: {
    type: Object,
    default: () => {}
  }
})
const formRef = ref()
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuOptions = ref([])
const expandedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])
/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' }
])
const formData = reactive<saveDataProp>({
  roleId: '',
  roleName: '',
  roleKey: '',
  dataScope: '1',
  deptIds: [],
  deptCheckStrictly: true
})
const resetForm = () => {
  menuOptions.value = []
  expandedKeys.value = []
  checkedKeys.value = []
  menuExpand.value = false
  menuNodeAll.value = false
  formData.roleId = ''
  formData.roleName = ''
  formData.roleKey = ''
  formData.dataScope = '1'
  formData.deptIds = []
  formData.deptCheckStrictly = true
}
const rulesRef = reactive({
  roleName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  roleKey: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    formData.roleId = props.curData.roleId
    formData.roleName = props.curData.roleName
    formData.roleKey = props.curData.roleKey
    formData.dataScope = props.curData.dataScope
    formData.deptCheckStrictly = props.curData.deptCheckStrictly
    getRoleMenuTreeselect(props.curData.roleId)
  }
})
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value) => {
  if (value !== '2') {
    checkedKeys.value = []
  }
}
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = async (roleId) => {
  const response = await deptTreeSelect(roleId)
  if (response?.code === 200) {
    menuOptions.value = response.data.depts
    nextTick(() => {
      checkedKeys.value = response.data.checkedKeys || []
    })
  }
}
/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (e: any) => {
  const treeList = menuOptions.value
  if (e.target.checked) {
    expandedKeys.value = treeList.map((item: any) => item.id)
  } else {
    expandedKeys.value = []
  }
}
/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (e: any) => {
  const treeList = menuOptions.value
  if (e.target.checked) {
    const list = flatten(treeList)
    checkedKeys.value = list.map((item: any) => item.id)
  } else {
    checkedKeys.value = []
  }
}
/** 树权限（父子联动） */
// const handleCheckedTreeConnect = (e: any) => {
//   formData.deptCheckStrictly = e.target.checked ? true : false
// }
const onCheck = (checkedKeys) => {
  checkedKeys.value = checkedKeys
}
const afterClose = () => {
  resetForm()
}
const handleOk = async () => {
  formRef.value
    .validate()
    .then(async () => {
      const params: saveDataProp = {
        roleName: formData.roleName,
        roleKey: formData.roleKey,
        dataScope: formData.dataScope,
        deptIds: checkedKeys.value,
        deptCheckStrictly: checkedKeys.value.deptCheckStrictly
      }
      params.roleId = props?.curData?.roleId
      const reponse = await dataScope(params)
      if (reponse?.code === 200) {
        showValue.value = false
        message.success($t('opeateSuccess'))
        emit('success')
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
:deep(.tree-border) {
  margin-top: 10px;
  border: 1px solid #d9d9d9;
}
</style>
