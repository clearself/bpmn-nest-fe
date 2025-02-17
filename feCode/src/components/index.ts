import type { App, Component } from 'vue'
// svg显示组件封装
import IconSvg from '@/components/IconSvg/index.vue'
import SvgIcon from '@/components/svg-icon/index.vue'
// 栅格布局组件
import SRow from '@/components/Row/index.vue'
import SCol from '@/components/Col/index.vue'
// 数字动画封装
import NumberAnimation from './NumberAnimation/index.vue'
// 金额格式化
import Statistic from './Statistic/index.vue'
// 多语言切换封装
import I18n from './I18n/index.vue'
// 下拉选搜索分页组件封装
import PageSelect from './PageSelect/index.vue'
// 表格列自定义设置组件封装
import FieldsSetting from './FieldsSetting/index.vue'
// 数据导入组件
import UploadImport from './UploadImport/index.vue'

// 数据导入组件
import DictTag from './DictTag/index.vue'
// 数据字典
import DictData from './DictData/index.vue'
// 水印
import Watermark from './Watermark/index.vue'

// 富文本编辑器
import Editor from './Editor/index.vue'

// 源码下载指南
import CodeDownload from './CodeDownload/index.vue'
// 源码下载
import DownloadCode from './DownloadCode/index.vue'

const components: { [name: string]: Component } = {
  IconSvg,
  SvgIcon,
  SRow,
  SCol,
  NumberAnimation,
  I18n,
  PageSelect,
  FieldsSetting,
  UploadImport,
  Statistic,
  DictTag,
  DictData,
  Watermark,
  Editor,
  CodeDownload,
  DownloadCode
}
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
  }
}
