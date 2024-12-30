<template>
  <section class="my-gantt">
    <div class="time-box">
      <a-form :model="fullData" layout="inline" style="margin-left: 15px">
        <a-form-item style="margin-left: 0px">
          <a-radio-group v-model:value="fullData.timeState" @change="changeTime">
            <a-radio-button
              v-for="(time, t_index) in fullData.timeList"
              :key="t_index"
              :value="time.code"
              size="small"
              border
              >{{ time.name }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <div style="height: 40px; position: relative; overflow: hidden">
            <a-tooltip title="已完成" placement="top">
              <div
                class="nav-complated"
                style="width: 14px; height: 14px; position: relative; float: left; top: 9px; border: 1px solid"
              />
            </a-tooltip>
            <a-tooltip title="进行中" placement="top">
              <div
                class="nav-ing"
                style="
                  width: 14px;
                  height: 14px;
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  top: 9px;
                  border: 1px solid;
                "
              />
            </a-tooltip>
            <a-tooltip title="未开始" placement="top">
              <div
                class="nav-lag"
                style="
                  width: 14px;
                  height: 14px;
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  top: 9px;
                  border: 1px solid;
                "
              />
            </a-tooltip>
            <a-tooltip title="逾期" placement="top">
              <div
                class="nav-warn"
                style="
                  width: 14px;
                  height: 14px;
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  top: 9px;
                  border: 1px solid;
                "
              />
            </a-tooltip>
            <a-tooltip title="正常" placement="top">
              <div
                class="nav-normal"
                style="
                  width: 14px;
                  height: 14px;
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  top: 9px;
                  border: 1px solid;
                "
              />
            </a-tooltip>
          </div>
        </a-form-item>
        <a-form-item>
          <a-tooltip title="是否显示左侧列表" placement="top">
            <a-switch
              v-model:checked="fullData.show"
              checked-children="是"
              un-checked-children="否"
              @change="changeShow"
            />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </div>
    <div id="gantt_here" class="gantt-container" />
  </section>
  <RightBox v-model:show="curShow" :task="curData" @success="onSuccess" />>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watchEffect, defineExpose, onBeforeUnmount } from 'vue'
import RightBox from './RightBox/index.vue'
import { timeFormat } from '@/utils/tools'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import demoData from './demoData.json'
import { nextTick } from 'vue'
const tasksData = ref(demoData)
const curData: any = ref({})
const curShow = ref(false)

//此方法是通过父子节点的关联性设置并且与时间相关联，父节点 设置 render: 'split'拆分子任务过程，子任务过程关联上父节点id（用parent）。可以通过设置子进程的开始结束时间或持续时间（duration）来设置子进程的长度。
// 注意id 的唯一性
const fullData = reactive({
  timeList: [
    {
      name: '日',
      code: 'day'
    },
    {
      name: '周',
      code: 'week'
    },
    {
      name: '月',
      code: 'month'
    }
  ],
  show: true,
  timeState: 'day',
  demoData: { data: [] }
})
const zoomConfig: any = {
  levels: [
    {
      name: 'day',
      scale_height: 50,
      min_column_width: 25,
      scales: [
        { unit: 'month', format: '%Y-%m' },
        {
          unit: 'day',
          step: 1,
          format: '%d',
          css: function (date: any) {
            if (date.getDay() == 0 || date.getDay() == 6) {
              return 'day-item weekend weekend-border-bottom'
            } else {
              return 'day-item'
            }
          }
        }
      ]
    },
    {
      name: 'week',
      scale_height: 50,
      min_column_width: 110,
      scales: [
        {
          unit: 'quarter',
          step: 1,
          format: function (date: any) {
            const yearStr = new Date(date).getFullYear() + '年'
            const dateToStr = gantt.date.date_to_str('%M')
            const endDate = gantt.date.add(gantt.date.add(date, 3, 'month'), -1, 'day')
            return yearStr + dateToStr(date) + ' - ' + dateToStr(endDate)
          }
        },
        {
          unit: 'week',
          step: 1,
          format: function (date: any) {
            const dateToStr = gantt.date.date_to_str('%m-%d')
            const endDate = gantt.date.add(date, 6, 'day')
            // const weekNum = gantt.date.date_to_str('%W')(date)
            return dateToStr(date) + ' 至 ' + dateToStr(endDate)
          }
        }
      ]
    },
    {
      name: 'month',
      scale_height: 50,
      min_column_width: 150,
      scales: [
        { unit: 'year', step: 1, format: '%Y年' },
        { unit: 'month', format: '%Y-%m' }
      ]
    }
  ]
}
const changeShow = (val: any) => {
  gantt.config.show_grid = val
  refreshData(tasksData.value)
}

//初始化甘特图
const initGantt = () => {
  //设置甘特图时间的起始结束时间，并允许显示超过时间刻度任务
  gantt.config.start_date = new Date(`${new Date().getFullYear()},${new Date().getMonth() - 6},${new Date().getDay()}`)
  gantt.config.end_date = new Date(`${new Date().getFullYear() + 1},${new Date().getMonth()},${new Date().getDay()}`)
  gantt.config.show_tasks_outside_timescale = true
  const dateToStr = gantt.date.date_to_str('%Y.%m.%d')
  gantt.config.grid_width = 380
  gantt.config.min_grid_column_width = 150 // 设置调整网格大小时左侧每一格的最小宽度---优先于grid_width
  gantt.config.autofit = true
  gantt.config.fit_tasks = true //自动延长时间刻度，以适应所有显示的任务
  gantt.config.auto_types = true //将包含子任务的任务转换为项目，将没有子任务的项目转换回任务
  gantt.config.xml_date = '%Y.%m.%d' //甘特图时间数据格式
  gantt.config.readonly = false //是否只读
  gantt.config.show_errors = false //不显示错误信息
  gantt.config.show_empty_state = true //显示空状态

  gantt.config.open_split_tasks = true //激活列表展开、折叠功能
  gantt.config.work_time = true // 是否允许在工作时间而不是日历时间中计算任务的持续时间

  gantt.config.smart_scales = true // 仅仅渲染在屏幕可见的那部分时间轴。在处理时间轴非常长的时候，可以提升性能

  gantt.config.smart_rendering = true // 按需渲染, 仅仅渲染在屏幕可见的那部分任务和依赖线。这个在显示大量的任务时，性能比较高。
  gantt.config.drag_links = false // 取消连线
  gantt.config.details_on_create = true
  gantt.config.resize_rows = true //用户可以通过拖拽调整行高
  // gantt.config.open_tree_initially = true //界面初始化时展开图表树形结构
  // gantt.config.open_tree_initially = true //界面初始化时展开图表树形结构
  //是否显示左侧树表格
  gantt.config.show_grid = fullData.show

  gantt.ext.draw = true
  // 配置Gantt内置弹出框元素(title内容)
  gantt.templates.lightbox_header = function (start_date, end_date, task) {
    return `<b>任务名称</b>`
  }

  //进度条
  gantt.templates.task_text = function (start, end, task) {
    let status = ''
    // const progressPerson = ''
    if (task.status == '1') {
      //未开始
      status = 'lag'
    } else if (task.status == '3') {
      //进行中
      status = 'ing'
    } else if (task.status == '4') {
      //逾期
      status = 'warn'
    } else if (task.status == '2') {
      status = 'ccompleted' //已完成
    } else {
      status = 'normal'
    }
    return ` <div class="project-progress-${status}">${task.text}
</div>`
  }
  //表格配置
  gantt.config.columns = [
    {
      name: 'text',
      label: '项目名称',
      resize: true,
      tree: true,
      align: 'left'
      // width: 150
    },
    {
      name: 'start_date',
      label: '开始时间',
      resize: true,
      align: 'center'
      // width: 150
    },
    { name: 'duration', label: '工期', align: 'center', width: 70 },
    { name: 'progress', label: '进度', align: 'center', width: 50 },
    { name: 'add', width: 44 }
  ]
  //更改树状的图标
  // gantt.templates.grid_open = (item) => {
  //   // console.log('item', item)
  //   const res = "<div  class='gantt_" +
  //     (item.$open ? "close" : "open") + "'></div>"
  //   return res
  // }
  //更改父项图标
  // gantt.templates.grid_folder = (item) => {
  //   return ''
  // }
  // //更改子项图标
  // gantt.templates.grid_file = (item) => {
  //   return ''
  // }
  gantt.i18n.setLocale('cn') //设置语言
  gantt.ext.zoom.init(zoomConfig) //配置初始化扩展
  // 开启marker插件
  gantt.plugins({ marker: true, tooltip: true })
  // const today = new Date(dayjs(new Date()).format("YYYY-MM-DD"));
  // const dateToStr2 = gantt.date.date_to_str(gantt.config.task_date);

  // 给时间Cell添加类名
  gantt.templates.timeline_cell_class = function (task, date) {
    if (!gantt.isWorkTime({ task: task, date: date })) return 'weekend'
  }
  // 给对应的时间线表格头部添加类名
  gantt.templates.scale_cell_class = function (date) {
    if (!gantt.isWorkTime(date)) return 'weekend'
  }
  gantt.templates.tooltip_text = function (start, end, task: any) {
    // console.log(start, end, task, 'tooltip_text')
    const progress = Math.round(task.progress * 100)
    const tooltip = ` <div>
          <div>项目名称：${task.text}</div>
          <div>开始时间：${dateToStr(task.start_date)}</div>
          <div>结束时间：${dateToStr(task.end_date)}</div>
          <div>进度：${progress}%</div>
        </div>`
    return tooltip
  }

  gantt.setSkin('meadow')
  gantt.init('gantt_here') //初始化

  gantt.config.grid_width = 380
  gantt.config.min_grid_column_width = 150 // 设置调整网格大小时左侧每一格的最小宽度---优先于grid_width
  gantt.config.row_height = 40 //设置行高
  refreshData(tasksData.value)
}

const refreshData = (tasks: any) => {
  gantt.clearAll()
  // 解析新的数据并刷新图表
  // 今日线
  gantt.addMarker({
    start_date: new Date(),
    css: 'today', // 今日线注意定义在初始化和填充数据前
    text: '今日',
    title: timeFormat(new Date().getTime(), 'YYYY-MM-DD')
  })
  gantt.ext.zoom.setLevel('day') //切换到指定的缩放级别x
  gantt.parse(tasks)
  gantt.showDate(new Date())
}
gantt.attachEvent('onTaskLoading', function (task: any) {
  if (task.end_date) task.end_date = gantt.date.parseDate(task.end_date, 'xml_date')
  return true
})
// 点击“+”进行添加任务操作触发
gantt.attachEvent('onTaskCreated', function (task) {
  console.log(task, '点击“+”进行添加任务操作触发')
  task.text = '任务名称'
  return true
})
// 用户拖拽任务后释放鼠标之后，应用更改之前触发
gantt.attachEvent('onAfterTaskDrag', function (id, mode, e) {
  const task = gantt.getTask(id)
  console.log(task, '拖拽之后出发')
  return false
})
//灯箱保存事件
gantt.attachEvent('onLightboxSave', function (id, task: any, is_new) {
  console.log(task)
  task.status = 1
  task.users = []
  task.open = true
  tasksData.value.data.push(task)
  refreshData(tasksData.value)
  return true
})
// 监听task任务的点击事件以替换默认的详情弹框
gantt.attachEvent('onTaskClick', function (id, e) {
  const task: any = gantt.getTask(id)
  console.log(task, '单击打开详情')
  return true
})
const onSuccess = (data: any) => {
  console.log(data, 'data')
  tasksData.value.data = tasksData.value.data.map((item: any) => {
    if (item.id === curData.value.id) {
      item.progress = data.progress
      item.status = data.status
      item.users = data.users
    }
    return item
  })
  refreshData(tasksData.value)
}
gantt.attachEvent('onTaskDblClick', function (id, e: any) {
  gantt.ext.tooltips.tooltip.hide()
  if (e.target.className == 'gantt_task_progress_wrapper' || e.target.className == 'gantt_task_progress') {
    const task: any = gantt.getTask(id)
    curData.value = task
    curShow.value = true
    console.log(e, task, '双击打开详情')
    return false
  }
  return true
})
// 灯箱删除事件
gantt.attachEvent('onLightboxDelete', function (id) {
  const task: any = gantt.getTask(id)
  // 添加条件以做对应的删除提示
  if (task.duration > 5) {
    alert('The duration is too long. Please, try again')
    return false
  }
  return true
})
const changeTime = () => {
  gantt.ext.zoom.setLevel(fullData.timeState)
  gantt.showDate(new Date())
}
onMounted(() => {
  nextTick(() => {
    initGantt()
  })
})
onBeforeUnmount(() => {
  gantt.ext.tooltips.tooltip.hide()
})
watchEffect(() => {})
defineExpose({
  ...toRefs(fullData)
})
</script>

<style lang="scss" scoped>
.my-gantt {
  height: calc(100vh - 160px);
  width: 100vw;
  ::v-deep(.gantt-container) {
    border-radius: 8px 0px 0px 8px;
    overflow: hidden;
    height: 100%;
  }
}
.a-form--inline .a-form-item {
  margin-right: 10px !important;
  margin-top: 10px !important;
}
.a-form-item__label {
  font-weight: 500 !important;
}
.today1 {
  background: red;
  color: red;
}
//树状图标打开
// ::v-deep(.gantt_open) {
//   width: 12px !important;
//   height: 100%;
//   background-image: url('../../../assets/imgs/left.png') !important;
//   background-repeat: no-repeat;
//   background-position: center center;
//   background-size: 100% auto;
//   margin-right: 5px;
//   transform: rotate(-90deg); //旋转90度
// }
//树状图标关闭
// ::v-deep(.gantt_close) {
//   width: 12px !important;
//   height: 100%;
//   background-image: url('../../../assets/imgs/left.png') !important ;
//   background-repeat: no-repeat;
//   background-position: center center;
//   background-size: 100% auto;
//   margin-right: 10px;
// }

/*表头隐藏*/
::v-deep(.box-item) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  display: inline-block;
}

//任务条自定义内容
::v-deep(.project-progress-ing),
.nav-ing {
  background: #ff9912 !important;
  color: black;
}
::v-deep(.project-progress-warn),
.nav-warn {
  background: #dd5640 !important;
}
::v-deep(.project-progress-ccompleted),
.nav-complated {
  background: #20b56d !important;
  color: black;
}
::v-deep(.project-progress-lag),
.nav-lag {
  background: #d4d4d4 !important;
  color: black;
}
::v-deep(.project-progress-normal),
.nav-normal {
  background: #537cfa !important;
  color: black;
}
.deadline {
  position: absolute;
  border-radius: 12px;
  border: 2px solid #585858;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: 6px;
  z-index: 1;
  background: url('../../../assets/imgs/warning.png') center no-repeat;
}
::v-deep(.overdue-indicator) {
  width: 20px !important;
  height: 100%;
  background: url('../../../assets/imgs/warning.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% auto;
}
::v-deep(.overdue-indicator1) {
  width: 20px !important;
  height: 100%;
  background: url('../../assets/skip1.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% auto;
}

::v-deep(.gantt_task_line) {
  background-color: rgba(0, 0, 0, 0) !important;
  border: 1px solid rgba(0, 0, 0, 0) !important;
}
::v-deep(.gantt_task_line.gantt_project) {
  background-color: #fff !important;
  border: 1px solid #fff !important;
}

::v-deep(.gantt_task_progress_wrapper) {
  z-index: 9 !important;
  .gantt_task_progress {
    background: none;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
  }
}
//设置任务条高度，以及圆角
::v-deep(.gantt_task_content) {
  color: #fff;
  // top: 0px;
  // height: 16px;
  border-radius: 50px;
}

// //调整字体高度，任务条距上边框的距离
// ::v-deep(.gantt_data_area div, .gantt_grid div) {
//   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//   line-height: 18px;
//   top: 5px;
// }

::v-deep(.gantt_task_row.gantt_selected) {
  background-color: rgba(0, 0, 0, 0) !important;
}
::v-deep(.gantt_grid_data .gantt_row.gantt_selected) {
  background-color: rgba(0, 0, 0, 0) !important;
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: red;
  }
}
// ::v-deep(.gantt_row.gantt_row_task) {
//   height: 36px !important;
//   line-height: 36px !important;
// }

// ::v-deep(.gantt_task_grid_row_resize_wrap) {
//   top: 36px !important;
// }
</style>
<style>
.weekend {
  background: #f4f7f4 !important;
}
</style>
