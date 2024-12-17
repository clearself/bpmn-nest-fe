<template>
  <div class="w100 h100">
    <a-layout style="height: 100%">
      <a-layout-header :style="headerStyle">
        <div class="ub ub-pj px-1">
          <div>
            <a-space>
              <a-button size="small" @click="importXML">导入XML</a-button>
              <a-button size="small" @click="preView">预览</a-button>
              <a-button size="small" @click="moreBig">放大</a-button>
              <a-button size="small" @click="moreSmall">缩小</a-button>
              <a-button size="small" @click="reset">还原并居中</a-button>
              <a-button size="small" :disabled="!revocable" @click="processUndo">撤销</a-button>
              <a-button size="small" :disabled="!revocable" @click="processRedo">恢复</a-button>
              <a-button size="small" @click="processRestart">重新绘制</a-button>
              <a-button size="small" @click="exportXML">下载xml</a-button>
              <a-button size="small" @click="exportSVG">下载svg</a-button>
              <a-button v-if="simulation" size="small" @click="processSimulation">{{
                simulationStatus ? '退出模拟' : '开启模拟'
              }}</a-button>
              <a-button size="small" @click="showHideMap">显示/隐藏地图</a-button>
            </a-space>
          </div>
          <div>
            <a-space>
              <!-- <a-button size="small">取消</a-button> -->
              <a-button type="primary" size="small" @click="toSave">保存</a-button>
            </a-space>
          </div>
        </div>
      </a-layout-header>
      <a-divider style="margin: 0" />
      <a-layout class="cav-container">
        <a-layout-content :style="contentStyle" @mousewheel.prevent>
          <div class="bpmn-page">
            <div id="modeler-container" ref="modelerContainer" class="modeler-container" />
          </div>
          <!-- <BpmnCanvas :bpmnID="'test'" :isReadOnly="false" ref="bpmnRef" @select:element="selectElement" /> -->
        </a-layout-content>
        <a-layout-sider class="silder-box" style="min-width: 300px">
          <panel
            :bpmnElementId="bpmnElementId"
            :users="users"
            :roles="roles"
            :groups="groups"
            :categorys="categorys"
            :businessObject="businessObject"
            :type="type"
          />
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </div>
  <!-- 查看实时生成的XML -->
  <a-modal v-model:open="xmlVisible" width="90%" :footer="null">
    <v-ace-editor v-model:value="xmlView" lang="xml" theme="chrome" :options="editorOptions" class="vue-ace-editor" />
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, nextTick, provide, watch } from 'vue'

// 模拟流转流程
import tokenSimulation from 'bpmn-js-token-simulation'
import translate from '@/packages/Bpmn/src/i18n'
import Modeler from 'bpmn-js/lib/Modeler'
import { PropertiesMap } from '@/packages/Bpmn/src/bpmn-type'
import createDefaultBpmnXml from '@/packages/Bpmn/src/defaultBpmnXml'
import createDefaultEmptyXml from '@/packages/Bpmn/src/defaultEmptyXml'
// 网格自适应北京
import GridLineModule from 'diagram-js-grid-bg'
// 模拟流转流程样式
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css'
// BPMN编辑器样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 小地图
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import miniMapModule from 'diagram-js-minimap'
import paletteProvider from '@/packages/Bpmn/src/bpnm-utils/palette-provider.ts'
import CustomContextPadProvider from '@/packages/Bpmn/src/bpnm-utils/custom-context-pad-provider.ts'
// // camunda描述json
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

// 标签解析 Moddle
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
// 标签解析 Extension
import camundaModdleExtension from './plugins/extension-moddle/camunda'
import activitiModdleExtension from './plugins/extension-moddle/activiti'
import flowableModdleExtension from './plugins/extension-moddle/flowable'

import type { CSSProperties } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import '@/config/aceConfig.js'
import type { Ace } from 'ace-builds'
import Panel from './PropertyPanel.vue'
const headerStyle: CSSProperties = reactive({
  color: '#555',
  height: 30,
  lineHeight: '30px',
  backgroundColor: '#ffffff'
})
const contentStyle: CSSProperties = reactive({
  color: '#555',
  backgroundColor: '#fbfbfb'
})
const emits = defineEmits(['result'])
const props = defineProps({
  simulation: {
    type: Boolean,
    default: true
  },
  xml: {
    type: String,
    default: ''
  },
  users: {
    type: Array,
    default: () => []
  },
  roles: {
    type: Array,
    default: () => []
  },
  groups: {
    type: Array,
    default: () => []
  },
  categorys: {
    type: Array,
    default: () => []
  },
  isView: {
    type: Boolean,
    default: false
  },
  bpmnID: {
    type: String,
    default: 'modeler-container'
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    default: () => {}
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  processId: {
    type: String,
    default: ''
  },
  processName: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: 'camunda'
  }
})
const modelerContainer = ref()
const zoom = ref<number>(1)
const xmlVisible = ref<boolean>(false)
const updatingProperties = ref<boolean>(false)
const revocable = ref<boolean>(false)
const recoverable = ref<boolean>(false)
const simulationStatus = ref<boolean>(false)

const xmlView = ref<string>('')
const type = ref<string>('')
const bpmnElementId = ref<string>('')
const businessObject: any = ref({})
const editorOptions: Partial<Ace.EditorOptions> = reactive({
  useWorker: true, // 启用语法检查,必须为true
  enableBasicAutocompletion: true, // 自动补全
  enableLiveAutocompletion: true, // 智能补全
  enableSnippets: true, // 启用代码段
  showPrintMargin: false, // 去掉灰色的线，printMarginColumn
  highlightActiveLine: false, // 高亮行
  highlightSelectedWord: true, // 高亮选中的字符
  tabSize: 4, // tab锁进字符
  fontSize: 14, // 设置字号
  wrap: false, // 是否换行
  readOnly: true, // 是否可编辑
  minLines: 1, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
  maxLines: 50 // 最大行数
})
let bpmnStore: any = null
let bpmnStoreElement: any = null
onMounted(() => {
  const Modules = []
  const Extensions: Record<any, any> = {}
  // 根据需要的 "流程类型" 设置 对应的解析文件
  if (props.prefix === 'camunda') {
    Modules.push(camundaModdleExtension)
    Extensions.camunda = camundaModdleDescriptor
  }
  if (props.prefix === 'flowable') {
    Modules.push(flowableModdleExtension)
    Extensions.flowable = flowableModdleDescriptor
  }
  if (props.prefix === 'activiti') {
    Modules.push(activitiModdleExtension)
    Extensions.activiti = activitiModdleDescriptor
  }

  if (props.isReadOnly) {
    bpmnStore = new Modeler({
      container: `#${props.bpmnID}`,
      additionalModules: [
        //添加翻译
        {
          translate: ['value', translate('zh')],
          paletteProvider: ['value', ''], //禁用/清空左侧工具栏
          labelEditingProvider: ['value', ''], //禁用节点编辑
          contextPadProvider: ['value', ''], //禁用图形菜单
          bendpoints: ['value', {}], //禁用连线拖动
          zoomScroll: ['value', ''], //禁用滚动
          moveCanvas: ['value', ''], //禁用拖动整个流程图
          move: ['value', ''] //禁用单个图形拖动
        },
        GridLineModule,
        ...Modules
      ],
      gridLine: {
        smallGridSpacing: 20,
        gridSpacing: 80,
        gridLineStroke: 1,
        gridLineOpacity: 0.2,
        gridLineColor: '#ddd'
        // gridLineColor: '#20e512'
      },
      moddleExtensions: Extensions,
      // {
      //   camunda: camundaModdleDescriptor
      // },
      ...props.options
    })
  } else {
    bpmnStore = new Modeler({
      container: `#${props.bpmnID}`,
      keyboard: props.keyboard ? { bindTo: document } : null,
      additionalModules: [
        //添加翻译
        { translate: ['value', translate('zh')] },
        paletteProvider,
        CustomContextPadProvider,
        tokenSimulation,
        miniMapModule,
        GridLineModule,
        ...Modules
      ],
      gridLine: {
        smallGridSpacing: 15,
        gridSpacing: 60,
        gridLineStroke: 1,
        gridLineOpacity: 0.25,
        gridLineColor: '#ddd'
        // gridLineColor: '#20e512'
      },
      moddleExtensions: Extensions,
      // {
      //   camunda: camundaModdleDescriptor
      // },
      ...props.options
    })
  }
  if (!props.xml) {
    newDiagram()
  } else {
    createNewDiagram(props.xml)
  }
  // 监听图形改变返回xml
  bpmnStore.on('commandStack.changed', async () => {
    recoverable.value = bpmnStore.get('commandStack').canRedo()
    revocable.value = bpmnStore.get('commandStack').canUndo()
  })
  bpmnStore.on('root.added', (e: any) => {
    if (e.element.type) {
      bpmnStoreElement = e.element
      type.value = getType(e.element)
      bpmnElementId.value = e.element.businessObject.id
      businessObject.value = e.element.businessObject
      console.log(e, type.value, 'typeInfo')
    }
  })

  const isFirefox = navigator.userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器;
  const addEvent = (function () {
    if (window.addEventListener) {
      return function (el: any, sType: any, fn: any, capture: any) {
        el.addEventListener(sType, fn, capture)
      }
    } else if (window.attachEvent) {
      return function (el: any, sType: any, fn: any) {
        el.attachEvent('on' + sType, fn)
      }
    } else {
      return function () {}
    }
  })()
  const stopEvent = function (event: any) {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  }
  const mousewheel = isFirefox ? 'DOMMouseScroll' : 'mousewheel'

  addEvent(
    modelerContainer.value,
    mousewheel,
    function (event: any) {
      const e = event || window.event
      event.preventDefault()
      stopEvent(e)
    },
    false
  )
})
const EVENT_TYPE = ['element.click', 'shape.added', 'element.changed']
// 添加绑定事件
const addBpmnListener = () => {
  EVENT_TYPE.forEach((typeItem) => {
    bpmnStore.on(typeItem, (e: any) => {
      if (typeItem === 'root.added' && !e.element.type) return
      if (!e.element) {
        return
      }
      if (e.element.type == 'label' && typeItem == 'shape.added') {
        return
      }
      //当前上下文中更新属性 触发element.changed直接过  不刷新业务对象 防止属性表单丢失焦点
      const updating = updatingProperties.value
      //当触发element.changed事件 需要判断改变的类型是否与当前选中的一样  一样才刷新
      const elementTypeNonEqualActive = e.element && e.element.id !== bpmnStoreElement?.id
      console.log(updating, elementTypeNonEqualActive, e.element.type, '1111111111')
      if ('element.changed' === typeItem && (updating || elementTypeNonEqualActive)) {
        return
      }
      nextTick(() => {
        if (
          typeItem === 'shape.added' &&
          ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:UserTask'].includes(e.element.type) &&
          !e.element.businessObject.name
        ) {
          // 当添加节点到编辑区 节点的name不存在时 初始化名称
          if (e.element.type == 'bpmn:StartEvent') {
            updateProperties(e.element, {
              name: '开始'
            })
          }
          if (e.element.type == 'bpmn:EndEvent') {
            updateProperties(e.element, {
              name: '结束'
            })
          } else if (e.element.type == 'bpmn:UserTask') {
            updateProperties(e.element, {
              name: '任务'
            })
          }
        }
        // 更新当前选中节点信息
        bpmnStoreElement = e.element
        type.value = getType(e.element)
        bpmnElementId.value = e.element.businessObject.id
        businessObject.value = e.element.businessObject
        console.log(e, type.value, typeItem, 'typeInfo')
      })
    })
  })
}

const getType = (element: any) => {
  let type = ''
  type = element?.businessObject?.$type
  return type
}
const toSave = () => {
  saveDiagram((err: any, xml: string) => {
    console.log(err)
    emits('result', {
      xml: xml
    })
  })
}
const saveDiagram = async (done: any) => {
  // 把传入的done再传给bpmn原型的saveXML函数调用
  const { err, xml } = await bpmnStore.saveXML({ format: true })
  done(err, xml)
}
const newDiagram = () => {
  const processId = props.processId || `Process_${new Date().getTime()}`
  const processName = props.processName || `业务流程_${new Date().getTime()}`
  createNewDiagram(createDefaultBpmnXml(processId, processName, props.prefix))
}
const createNewDiagram = (xml?: string | null) => {
  return new Promise<void>((resolve, reject) => {
    try {
      bpmnStore
        .importXML(xml)
        .then((result: any) => {
          addBpmnListener()
          if (result.length) {
            // 居中
            reset()
          }
          resolve()
        })
        .catch((err: any) => {
          reject()
          console.warn('importFail errors ', err)
        })
    } catch (err: any) {
      reject()
      console.error(err.message, err.warnings)
    }
  })
}

//更新节点数据
const updateProperties = (element: any, properties: PropertiesMap<any>) => {
  updatingProperties.value = true
  bpmnStore.get('modeling').updateProperties(element, properties)
  updatingProperties.value = false
}
//获取当前节点
const bpmnElement = () => {
  return bpmnStoreElement
}
//获取bpmn示例
const bpmnInstances: any = () => {
  return {
    modeler: bpmnStore,
    modeling: bpmnStore.get('modeling'),
    moddle: bpmnStore.get('moddle'),
    eventBus: bpmnStore.get('eventBus'),
    bpmnFactory: bpmnStore.get('bpmnFactory'),
    elementFactory: bpmnStore.get('elementFactory'),
    elementRegistry: bpmnStore.get('elementRegistry'),
    replace: bpmnStore.get('replace'),
    selection: bpmnStore.get('selection')
  }
}
// 使用provide提供函数
provide('updateProperties', updateProperties)
provide('bpmnElement', bpmnElement)
provide('bpmnInstances', bpmnInstances)
provide('prefix', props.prefix)

onBeforeUnmount(() => {
  bpmnStore = null
})

const getXML = () => {
  return new Promise((resolve, reject) => {
    bpmnStore
      .saveXML({ format: true })
      .then((response: { xml: string }) => {
        resolve(response)
      })
      .catch((err: unknown) => {
        reject(err)
      })
  })
}
const preView = async () => {
  xmlVisible.value = true
  try {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { xml }: any = await getXML()
    xmlView.value = xml
  } catch (err) {
    console.log(err)
  }
}
// 导入XML
const importXML = () => {
  const fileUpload: any = document.createElement('input')
  fileUpload.type = 'file'
  fileUpload.click()
  fileUpload.onchange = () => {
    const file = fileUpload.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const xml: any = reader.result
      bpmnStore.importXML(xml)
    }
    reader.readAsText(file)
  }
}

const processRedo = () => {
  bpmnStore.get('commandStack').redo()
}
const processUndo = () => {
  bpmnStore.get('commandStack').undo()
}
const processRestart = () => {
  recoverable.value = false
  revocable.value = false
  const processId = props.processId || `Process_${new Date().getTime()}`
  const processName = props.processName || `业务流程_${new Date().getTime()}`
  createNewDiagram(createDefaultEmptyXml(processId, processName, props.prefix)).then(() => {
    reset()
  })
}

const processSimulation = () => {
  simulationStatus.value = !simulationStatus.value
  props.simulation && bpmnStore.get('toggleMode').toggleMode()
}
// 放大
const moreBig = () => {
  zoom.value = Math.floor(zoom.value * 100 + 0.1 * 100) / 100
  bpmnStore.get('canvas').zoom(zoom.value)
}
// 缩小
const moreSmall = () => {
  zoom.value = Math.floor(zoom.value * 100 - 0.1 * 100) / 100
  bpmnStore.get('canvas').zoom(zoom.value)
}
// 缩小
const reset = () => {
  zoom.value = 1
  bpmnStore.get('canvas').zoom('fit-viewport', 'auto')
}

// 导出XML
const exportXML = () => {
  const rootElement = bpmnStore.get('canvas').getRootElement()
  getXML()
    .then((response: any) => {
      download(response.xml, rootElement.id || 'process', 'bpmn')
    })
    .catch((err: unknown) => {
      console.warn(err)
    })
}
// 导出SVG
const getSVG = () => {
  return new Promise((resolve, reject) => {
    bpmnStore
      .saveSVG()
      .then((response: { svg: string }) => {
        resolve(response)
      })
      .catch((err: unknown) => {
        reject(err)
      })
  })
}
const showHideMap = () => {
  bpmnStore.get('minimap').toggle()
}
const exportSVG = () => {
  const rootElement = bpmnStore.get('canvas').getRootElement()
  getSVG()
    .then((response: any) => {
      download(response.svg, rootElement.id || 'process', 'svg')
    })
    .catch((err: unknown) => {
      console.warn(err)
    })
}

//文本下载
const download = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data])
  const tempLink = document.createElement('a') // 创建a标签
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  //filename
  const fileName = `${filename}.${type}`
  tempLink.href = href
  tempLink.target = '_blank'
  tempLink.download = fileName
  document.body.appendChild(tempLink)
  tempLink.click() // 点击下载
  document.body.removeChild(tempLink) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
</script>

<style lang="scss" scoped>
:deep(.ant-layout .ant-layout-header) {
  height: 30px;
}
.cav-container {
  height: calc(100% - 31px);
  .canvas {
    width: 100%;
    height: 100%;
  }
}
:deep(.ant-layout-sider) {
  flex: 0 0 350px !important;
  max-width: 350px !important;
  min-width: 350px !important;
  width: 350px !important;
  background: #ffffff !important;
  border-left: 1px solid #f1f1f1;
  overflow-y: auto;
}
.vue-ace-editor {
  /* ace-editor默认没有高度，所以必须设置高度，或者同时设置最小行和最大行使编辑器的高度自动增高 */
  // height: 500px;
  width: 98%;
  font-size: 16px;
  border: 1px solid;
}

.bpmn-page {
  width: 100%;
  height: 100%;
  position: relative;
}

.bjs-powered-by {
  display: none;
}

.bpmn-container {
  height: 100%;
}

.modeler-container {
  position: relative;
  flex: 1;
  height: 100%;
  // background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')
  //   repeat !important;
}

.djs-palette {
  top: 65px !important;
  border: none !important;
  background-color: #fff !important;
  box-shadow: 0 3px 3px rgb(0 0 0 / 20%);
}

:deep(.djs-palette.two-column.open) {
  width: 100px !important;
}

.icon-custom {
  /* 定义一个公共的类名 */
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 65%;
}

:deep(.icon-custom.lindaidai-task) {
  width: 30px;
  height: 30px;
  margin: 8px;

  /* 加上背景图 */
  background: url('https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png') no-repeat;
  background-size: 100% 100%;
}

:deep(.djs-context-pad) .lindaidai-task.entry:hover {
  background: url('https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png') no-repeat;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 95%;
}

:deep(.djs-context-pad) .entry:hover {
  /* 重新修改了 hover 之后的样式 */

  /* border: 1px solid #1890ff; */
  box-sizing: border-box;
}

:deep(.djs-context-pad) .entry {
  box-sizing: border-box;
  transition: all 0.3s;
  background-size: 94%;
}

.default-input {
  margin-bottom: 10px;
}

.bpmn-operation {
  position: absolute;
  bottom: 2%;
  left: 1%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
    margin-right: 16px;
    cursor: pointer;
  }
  // background-color: red;
}
:deep(a.bjs-powered-by) {
  display: none;
}
:deep(.bts-toggle-mode) {
  display: none;
}
:deep(.djs-palette) {
  background: #f1f1f1;
  border: solid 1px #ddd !important;
  border-radius: 5px;
}
//侧边栏配置
:deep(.djs-palette.open) {
  .djs-palette-entries {
    div[class^='bpmn-icon-']:before,
    div[class*='bpmn-icon-']:before {
      line-height: unset;
    }
    div.entry {
      position: relative;
    }
    div.entry:hover {
      &::after {
        width: max-content;
        content: attr(title);
        vertical-align: text-bottom;
        position: absolute;
        right: -10px;
        top: 0;
        bottom: 0;
        overflow: hidden;
        transform: translateX(100%);
        font-size: 0.5em;
        display: inline-block;
        text-decoration: inherit;
        font-variant: normal;
        text-transform: none;
        background: #fafafa;
        box-shadow: 0 0 6px #eeeeee;
        border: 1px solid #cccccc;
        box-sizing: border-box;
        padding: 0 16px;
        border-radius: 4px;
        z-index: 100;
      }
    }
  }
}
:deep(.djs-palette.open) {
  width: 94px !important;
}
:deep(.djs-popup-backdrop) {
  position: absolute;
  width: 100%;
  height: 100%;
}
:deep(.djs-popup-group) li[data-id^='replace-with-message-intermediate-throw'],
:deep(.djs-popup-group) li[data-id^='replace-with-message-intermediate-catch'],
:deep(.djs-popup-group) li[data-id^='replace-with-escalation-intermediate-throw'],
:deep(.djs-popup-group) li[data-id^='replace-with-conditional-intermediate-catch'],
:deep(.djs-popup-group) li[data-id^='replace-with-link-intermediate-throw'],
:deep(.djs-popup-group) li[data-id^='replace-with-link-intermediate-catch'],
:deep(.djs-popup-group) li[data-id^='replace-with-compensation-intermediate-throw'],
:deep(.djs-popup-group) li[data-id^='replace-with-compensation-intermediate-catch'],
:deep(.djs-popup-group) li[data-id^='replace-with-signal-intermediate-throw'],
:deep(.djs-popup-group) li[data-id^='replace-with-signal-intermediate-catch'] {
  display: none;
}
:deep(.djs-minimap) {
  top: auto;
  bottom: 20px !important;
  .toggle {
    display: none;
  }
}
</style>
