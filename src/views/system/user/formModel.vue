<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
    width="800px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '100px' } }">
        <a-row>
          <a-col :span="12">
            <a-form-item :label="$t('user.columns.nickName')" name="nickName" :rules="rulesRef.nickName">
              <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.nickName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('user.columns.beDeptName')" name="deptId" :rules="rulesRef.deptId">
              <a-tree-select
                v-model:value="formData.deptId"
                :placeholder="$t('selectTips')"
                :tree-data="deptOptions"
                show-search
                allow-clear
                tree-default-expand-all
                style="width: 100%"
                tree-node-filter-prop="label"
                :fieldNames="{ label: 'label', value: 'id', children: 'children' }"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('user.columns.phonenumber')" name="phonenumber" :rules="rulesRef.phonenumber">
              <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.phonenumber" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('user.columns.email')" name="email" :rules="rulesRef.email">
              <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.email" />
            </a-form-item>
          </a-col>
          <a-col v-if="status === 'add'" :span="12">
            <a-form-item :label="$t('user.columns.userName')" name="userName" :rules="rulesRef.userName">
              <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.userName" />
            </a-form-item>
          </a-col>
          <a-col v-if="status === 'add'" :span="12">
            <a-form-item :label="$t('user.columns.password')" name="password" :rules="rulesRef.password">
              <a-input allowClear :placeholder="$t('placeholder25')" v-model:value.trim="formData.password" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('user.columns.sex')">
              <a-select
                show-search
                :filter-option="filterOption"
                :options="sysUserSex"
                allowClear
                :placeholder="$t('selectTips')"
                style="width: 100%"
                v-model:value="formData.sex"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('user.columns.state')">
              <a-radio-group v-model:value="formData.status" name="postState">
                <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{
                  dict.label
                }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('user.columns.post')">
              <a-select
                mode="multiple"
                :max-tag-count="2"
                show-search
                :filter-option="filterOption"
                :options="postOptions"
                allowClear
                :placeholder="$t('selectTips')"
                style="width: 100%"
                v-model:value="formData.postIds"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('user.columns.role')">
              <a-select
                mode="multiple"
                :max-tag-count="2"
                show-search
                :filter-option="filterOption"
                :options="roleOptions"
                allowClear
                :placeholder="$t('selectTips')"
                style="width: 100%"
                v-model:value="formData.roleIds"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('user.columns.remark')">
              <a-textarea allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.remark" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { add, edit, getUser } from './server'
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
  sysUserSex: {
    type: Array,
    default: () => []
  },
  sysNormalDisable: {
    type: Array,
    default: () => []
  },
  deptOptions: {
    type: Array,
    default: () => []
  }
})
const formRef = ref()

const postOptions = ref([])
const roleOptions = ref([])
const formData = reactive({
  userId: '',
  userName: '',
  nickName: '',
  deptId: undefined,
  phonenumber: '',
  email: '',
  password: '',
  sex: undefined,
  postIds: undefined,
  roleIds: undefined,
  status: '0',
  remark: ''
})
const resetForm = () => {
  formData.userId = ''
  formData.userName = ''
  formData.nickName = ''
  formData.deptId = undefined
  formData.phonenumber = ''
  formData.email = ''
  formData.password = ''
  formData.sex = undefined
  formData.postIds = undefined
  formData.roleIds = undefined
  formData.remark = ''
  formData.status = '0'
}
const rulesRef = reactive({
  nickName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  userName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  deptId: [{ required: true, message: $t('selectTips'), trigger: ['blur', 'change'] }],
  password: [
    { required: true, message: $t('inputTips'), trigger: 'blur' },
    { min: 5, max: 20, message: $t('placeholder25'), trigger: 'blur' }
  ],
  email: [{ type: 'email', message: $t('placeholder26'), trigger: ['blur', 'change'] }],
  phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: $t('placeholder27'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      console.log(props.curData, 'props.curData')
      formData.userId = props.curData.userId
      formData.userName = props.curData.userName
      formData.nickName = props.curData.nickName
      formData.deptId = props.curData.deptId
      formData.phonenumber = props.curData.phonenumber
      formData.email = props.curData.email
      formData.sex = props.curData.sex
      formData.remark = props.curData.remark
      formData.status = props.curData.status
      initPostRoleData(props.curData.userId)
    } else {
      initPostRoleData()
    }
  }
})
const initPostRoleData = async (userId?: string) => {
  const res: any = await getUser(userId)
  console.log(res, 'dept')
  if (res?.code === 200) {
    const response = res.data
    const posts = response.posts.filter((item: any) => item.status === '0')
    postOptions.value = posts.map((item: any) => ({
      label: item.postName,
      value: item.postId
    }))

    const roles = response.roles.filter((item: any) => item.roleId !== 1 && item.status === '0')
    roleOptions.value = roles.map((item: any) => ({
      label: item.roleName,
      value: item.roleId
    }))
    if (userId) {
      formData.postIds = response.postIds
      formData.roleIds = response.roleIds
    }
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
      if (props.status === 'edit') {
        const params: {
          userId?: string
          nickName: string
          deptId?: string
          phonenumber?: string
          email?: string
          sex?: string
          postIds?: number[]
          roleIds?: number[]
          remark?: string
          status?: string
        } = {
          nickName: formData.nickName,
          deptId: formData.deptId,
          phonenumber: formData.phonenumber,
          email: formData.email,
          sex: formData.sex,
          postIds: formData.postIds,
          roleIds: formData.roleIds,
          remark: formData.remark,
          status: formData.status
        }
        params.userId = props?.curData?.userId
        const reponse = await edit(params)
        if (reponse?.code === 200) {
          showValue.value = false
          message.success($t('opeateSuccess'))
          emit('success')
        }
      } else {
        const params: {
          userName: string
          password: string
          nickName: string
          deptId?: string
          phonenumber?: string
          email?: string
          sex?: string
          postIds?: number[]
          roleIds?: number[]
          remark?: string
          status?: string
        } = {
          userName: formData.userName,
          password: formData.password,
          nickName: formData.nickName,
          deptId: formData.deptId,
          phonenumber: formData.phonenumber,
          email: formData.email,
          sex: formData.sex,
          postIds: formData.postIds,
          roleIds: formData.roleIds,
          remark: formData.remark,
          status: formData.status
        }
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
