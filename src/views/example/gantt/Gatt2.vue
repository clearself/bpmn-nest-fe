<template>
  <div ref="cont" style="width: 100%; height: 100%" />
</template>
<script>
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

export default {
  props: ['tasks'],

  mounted() {
    const gantt = gantt.getGanttInstance()
    gantt.init(this.$refs.cont)
    gantt.parse(this.tasks)

    this.gantt = gantt
  },
  unmounted() {
    this.gantt.destructor()
    this.$refs.cont.innerHTML = ''
  }
}
</script>
