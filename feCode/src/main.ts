import { createApp } from 'vue'
import './style.css'
// import 'default-passive-events';
import App from './App.vue'
// import cfg from "@/config/config";
import Antd from 'ant-design-vue'
import store from '@/store'
import router from '@/routers'
import '@/routers/permission'
// import "ant-design-vue/dist/antd.css";
import 'ant-design-vue/dist/reset.css'
import globalComponent from '@/components/index'
import '@/iconfont/iconfont.css'
import '@/styles/index.scss'
import { loadDirectives } from '@/directives'
// 导入多语言
import i18n from '@/i18n'
// import SvgIcon from '@/components/svg-icon/inndex.vue'
import '@/assets/iconfont/iconfont.js'
import 'virtual:svg-icons-register'
import { useDict } from '@/utils/dict.ts'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import Socketio from '@/plugins/Socket.io'
// console.log("all config:",cfg)
const app = createApp(App)
// 全局方法挂载
app.config.globalProperties.useDict = useDict
// app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 将多语言挂在到vue中
// console.log("app: ", app);
// console.log("app.config.globalProperties: ", app.config.globalProperties);
// export const appConfig = app.config.globalProperties;
// echarts 注册主题
import '@/assets/js/theme/normal.js'
import '@/assets/js/theme/orange.js'
/** 加载自定义指令 */
loadDirectives(app)

// app.component('SvgIcon', SvgIcon)
app.use(store).use(globalComponent).use(i18n).use(Antd).use(router)
app.use(Socketio, {
  connection: import.meta.env.VITE_API_URL,
  options: {
    autoConnect: false //关闭自动连接
    // ...其它选项
  }
})
router.isReady().then(() => {
  app.mount('#app')
})
