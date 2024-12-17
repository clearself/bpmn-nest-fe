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
        <a-form-item :label="$t('role.columns.roleName')" name="roleName" :rules="rulesRef.roleName">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.roleName" />
        </a-form-item>
        <a-form-item :label="$t('role.columns.roleKey')" name="roleKey" :rules="rulesRef.roleKey">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.roleKey" />
        </a-form-item>
        <a-form-item :label="$t('role.columns.menuPermission')">
          <a-checkbox v-model:checked="menuExpand" @change="handleCheckedTreeExpand">展开/折叠</a-checkbox>
          <a-checkbox v-model:checked="menuNodeAll" @change="handleCheckedTreeNodeAll">全选/全不选</a-checkbox>
          <!-- <a-checkbox v-model:checked="formData.menuCheckStrictly" @change="handleCheckedTreeConnect"
          >父子联动</a-checkbox
        > -->
          <a-tree
            class="tree-border"
            v-model:expandedKeys="expandedKeys"
            v-model:checkedKeys="checkedKeys"
            :tree-data="menuOptions"
            checkable
            @check="onCheck"
            :check-strictly="!formData.menuCheckStrictly"
            :fieldNames="{ title: 'label', key: 'id', children: 'children' }"
          />
        </a-form-item>
        <a-form-item :label="$t('role.columns.state')">
          <a-radio-group v-model:value="formData.status" name="postState">
            <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('role.columns.remark')">
          <a-textarea allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.remark" />
        </a-form-item>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, nextTick, getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
const { proxy } = getCurrentInstance() as any
import { $t } from '@/i18n'
import { flatten } from '@/utils/tools'
import { saveDataProp } from './type'
import { add, edit } from './server'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/views/system/menu/server'
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
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuOptions = ref([])
const expandedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])
const formData = reactive<saveDataProp>({
  roleId: '',
  roleName: '',
  roleKey: '',
  status: '0',
  menuIds: [],
  menuCheckStrictly: true,
  remark: ''
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
  formData.remark = ''
  formData.status = '0'
  formData.menuIds = []
  formData.menuCheckStrictly = true
}
const rulesRef = reactive({
  roleName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  roleKey: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.roleId = props.curData.roleId
      formData.roleName = props.curData.roleName
      formData.roleKey = props.curData.roleKey
      formData.remark = props.curData.remark
      formData.status = props.curData.status
      formData.menuCheckStrictly = props.curData.menuCheckStrictly
      getRoleMenuTreeselect(props.curData.roleId)
    } else {
      getMenuTreeselect()
    }
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
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = async (roleId: string) => {
  const response: any = await roleMenuTreeselect(roleId)
  if (response?.code === 200) {
    const listFilter = response?.data?.menus ?? []
    //.filter((item) => item.id !== 1)
    const list = flatten(listFilter || [])
    const _list = list.map((item: any) => {
      if (item?.label) {
        item.label = $t(item.label)
      }
      return item
    })
    menuOptions.value = proxy.handleTree(_list, 'id')
    nextTick(() => {
      checkedKeys.value = response.data.checkedKeys || []
    })
  }
}
/** 查询菜单树结构 */
const getMenuTreeselect = async () => {
  const res: any = await menuTreeselect()
  if (res?.code === 200) {
    // 过滤出 系统设置 只有超管角色才有
    const { data = [] } = res
    const listFilter = data
    //.filter((item) => item.id !== 1)
    const list = flatten(listFilter || [])
    const _list = list.map((item: any) => {
      if (item?.label) {
        item.label = $t(item.label)
      }
      return item
    })
    menuOptions.value = proxy.handleTree(_list, 'id')
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
//   formData.menuCheckStrictly = e.target.checked ? true : false
// }
const onCheck = (checkedKeys: any) => {
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
        remark: formData.remark,
        status: formData.status,
        menuIds: checkedKeys.value,
        menuCheckStrictly: formData.menuCheckStrictly ? 1 : 0
      }
      if (props.status === 'edit') {
        params.roleId = props?.curData?.roleId
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
:deep(.tree-border) {
  margin-top: 10px;
  border: 1px solid #d9d9d9;
}
</style>
