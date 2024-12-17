<template>
  <div class="modal-wrapper" ref="mymodal">
    <a-modal
      destroyOnClose
      :getContainer="() => $refs.mymodal"
      v-model:open="showValue"
      :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
      width="700px"
      :cancelText="$t('opts.cancel')"
      :okText="$t('opts.sure')"
      :afterClose="afterClose"
      @ok="handleOk"
    >
      <watermark>
        <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
          <a-form-item :label="$t('menu.columns.parentMenu')" name="parentId" :rules="rulesRef.parentId">
            <a-tree-select
              v-model:value="formData.parentId"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :placeholder="$t('selectTips')"
              allow-clear
              :tree-data="treeData"
              :field-names="{
                children: 'children',
                label: 'menuName',
                value: 'menuId'
              }"
              tree-node-filter-prop="menuName"
            />
          </a-form-item>
          <a-form-item :label="$t('menu.columns.menuType')">
            <a-radio-group v-model:value="formData.menuType" name="menuType">
              <a-radio value="M">目录</a-radio>
              <a-radio value="C">菜单</a-radio>
              <a-radio value="F">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('menu.columns.menuIcon')" v-if="formData.menuType != 'F'">
            <a-popover v-model:open="showChooseIcon" placement="bottom" trigger="click" @show="showSelectIcon">
              <template #content>
                <icon-select
                  style="width: 540px"
                  ref="iconSelectRef"
                  @selected="selected"
                  :active-icon="formData.icon"
                />
              </template>
              <a-input v-model:value="formData.icon" placeholder="点击选择图标" @blur="showSelectIcon" readonly>
                <template #prefix>
                  <div class="ub">
                    <icon-svg v-if="formData.icon" :name="formData.icon" style="height: 16px; width: 16px" />
                    <SearchOutlined v-else style="height: 16px; width: 16px" />
                  </div>
                </template>
              </a-input>
            </a-popover>
          </a-form-item>
          <a-form-item :label="$t('menu.columns.menuName')" name="menuName" :rules="rulesRef.menuName">
            <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.menuName" />
          </a-form-item>
          <a-form-item :label="$t('menu.columns.orderNum')" name="orderNum" :rules="rulesRef.orderNum">
            <a-input-number v-model:value="formData.orderNum" :min="0" />
          </a-form-item>
          <a-form-item v-if="formData.menuType != 'F'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>选择是外链则路由地址需要以`http(s)://`开头</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.isExternalLink') }}
              </span>
            </template>
            <a-radio-group v-model:value="formData.isFrame" name="isFrame">
              <a-radio value="0">是</a-radio>
              <a-radio value="1">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="formData.menuType != 'F'" name="path" :rules="rulesRef.path">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.routerAddress') }}
              </span>
            </template>
            <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.path" />
          </a-form-item>
          <a-form-item v-if="formData.menuType === 'C'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>访问的组件路径，如：`system/user/index`，默认在`views`目录下</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.componentPath') }}
              </span>
            </template>
            <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.component" />
          </a-form-item>
          <a-form-item v-if="formData.menuType != 'M'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title
                    >控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)</template
                  >
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.permissionIdentification') }}
              </span>
            </template>
            <a-input allowClear :placeholder="$t('inputTips')" :maxlength="100" v-model:value.trim="formData.perms" />
          </a-form-item>

          <a-form-item v-if="formData.menuType === 'C'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.routerParams') }}
              </span>
            </template>
            <a-input allowClear :placeholder="$t('inputTips')" :maxlength="255" v-model:value.trim="formData.query" />
          </a-form-item>
          <a-form-item v-if="formData.menuType === 'C'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.routerParams') }}
              </span>
            </template>
            <a-radio-group v-model:value="formData.isCache" name="isCache">
              <a-radio value="0">缓存</a-radio>
              <a-radio value="1">不缓存</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="formData.menuType !== 'F'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>选择隐藏则路由将不会出现在侧边栏，但仍然可以访问</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.displayState') }}
              </span>
            </template>
            <a-radio-group v-model:value="formData.visible">
              <a-radio v-for="dict in sys_show_hide" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="formData.menuType !== 'F'">
            <template #label>
              <span>
                <a-tooltip placement="top">
                  <template #title>选择停用则路由将不会出现在侧边栏，也不能被访问</template>
                  <QuestionCircleFilled class="mr-05" /> </a-tooltip
                >{{ $t('menu.columns.menuState') }}
              </span>
            </template>
            <a-radio-group v-model:value="formData.status">
              <a-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{
                dict.label
              }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </watermark>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, getCurrentInstance } from 'vue'
import { QuestionCircleFilled, SearchOutlined } from '@ant-design/icons-vue'

import IconSelect from '@/components/IconSelect/index.vue'
const { proxy } = getCurrentInstance() as any
const { sys_show_hide, sys_normal_disable } = proxy.useDict('sys_show_hide', 'sys_normal_disable')
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { saveDataProp } from './type'
import { add, edit, listMenu } from './server'
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

const iconSelectRef = ref()
const showChooseIcon = ref(false)
const treeData = ref<any[]>([])
const formData = reactive<saveDataProp>({
  menuId: '',
  parentId: 0,
  menuName: '',
  menuType: 'M',
  icon: '',
  orderNum: 0,
  isFrame: '1',
  path: '',
  component: '',
  perms: '',
  query: '',
  visible: '0',
  isCache: '0',
  status: '0'
})
const resetForm = () => {
  formData.menuId = ''
  formData.parentId = 0
  formData.menuName = ''
  formData.menuType = 'M'
  formData.icon = ''
  formData.orderNum = 0
  formData.isFrame = '1'
  formData.path = ''
  formData.component = ''
  formData.perms = ''
  formData.query = ''
  formData.isCache = '0'
  formData.visible = '0'
  formData.status = '0'
}
const rulesRef = reactive({
  parentId: [{ required: true, message: $t('selectTips'), trigger: ['blur', 'change'] }],
  menuName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  orderNum: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  path: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.menuId = props.curData.menuId
      formData.parentId = props.curData.parentId
      formData.menuName = props.curData.menuName
      formData.menuType = props.curData.menuType
      formData.icon = props.curData.icon
      formData.orderNum = props.curData.orderNum
      formData.isFrame = props.curData.isFrame
      formData.path = props.curData.path
      formData.component = props.curData.component
      formData.perms = props.curData.perms
      formData.query = props.curData.query
      formData.isCache = props.curData.isCache
      formData.visible = props.curData.visible
      formData.status = props.curData.status
    }
  }
})

const initTreeMenuAll = async () => {
  const res: any = await listMenu()
  if (res?.code === 200) {
    const list = res.data.map((item: any) => {
      if (item.menuName) {
        item.menuName = $t(item.menuName)
      }
      return item
    })
    const menu = { menuId: 0, menuName: $t('fly.menu.main.category'), children: [] }
    menu.children = proxy.handleTree(list, 'menuId')
    treeData.value.push(menu)
  }
}
initTreeMenuAll()
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef?.value.reset()
  showChooseIcon.value = true
}
/** 选择图标 */
function selected(name: string) {
  formData.icon = name
  showChooseIcon.value = false
}
// /** 图标外层点击隐藏下拉列表 */
// function hideSelectIcon(event: any) {
//   const elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget
//   const className = elem.className
//   if (className !== 'a-input__inner') {
//     showChooseIcon.value = false
//   }
// }

const afterClose = () => {
  resetForm()
}

const handleOk = async () => {
  formRef.value
    .validate()
    .then(async () => {
      const params: saveDataProp = {
        parentId: formData.parentId,
        menuName: formData.menuName,
        orderNum: formData.orderNum,
        menuType: formData.menuType,
        icon: formData.icon,
        isFrame: formData.isFrame,
        path: formData.path,
        component: formData.component,
        perms: formData.perms,
        query: formData.query,
        visible: formData.visible,
        isCache: formData.isCache,
        status: formData.status
      }
      if (props.status === 'edit') {
        params.menuId = props?.curData?.menuId
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
.mr-05 {
  margin-right: 5px;
}
:deep(.ant-popover) {
  width: 540px !important;
}
</style>
