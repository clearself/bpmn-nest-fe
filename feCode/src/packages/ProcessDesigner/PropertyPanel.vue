<template>
  <div ref="propertyPanel" class="property-panel">
    <div class="node-name"><i /><span>常规</span></div>
    <component
      :is="getComponent"
      :bpmnElementId="bpmnElementId"
      :users="users"
      :roles="roles"
      :groups="groups"
      :categorys="categorys"
      :businessObject="businessObject"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Base from './components/Base/index.vue'
import StartEndPanel from './components/StartEnd.vue'
import ProcessPanel from './components/Process.vue'
import NoUser from './components/NoUser.vue'
import Stage from './components/Stage.vue'
import FlowCondition from './components/FlowCondition/index.vue'
import CatchEvent from './components/CatchEvent/index.vue'
import BoundaryEvent from './components/BoundaryEvent/index.vue'

import UserTask from './components/task/UserTask/index.vue'
import Task from './components/task/Task/index.vue'
import ServiceTask from './components/task/ServiceTask/index.vue'
import ScriptTask from './components/task/ScriptTask/index.vue'
import ReceiveTask from './components/task/ReceiveTask/index.vue'

const props = defineProps({
  bpmnElementId: {
    type: String
  },
  users: {
    type: Array,
    required: true
  },
  roles: {
    type: Array,
    required: true
  },
  groups: {
    type: Array,
    required: true
  },
  categorys: {
    type: Array,
    required: true
  },
  businessObject: Object,
  type: {
    type: String,
    default: ''
  }
})
const getComponent = computed(() => {
  console.log('props.type', props.type)
  if (['bpmn:StartEvent', 'bpmn:EndEvent'].includes(props.type)) {
    return StartEndPanel
  } else if (props.type === 'bpmn:Process') {
    return ProcessPanel
  } else if (props.type === 'bpmn:Group') {
    return Stage
  } else if (props.type === 'bpmn:SequenceFlow') {
    return FlowCondition
  } else if (props.type === 'bpmn:IntermediateCatchEvent') {
    return CatchEvent
  } else if (props.type === 'bpmn:BoundaryEvent') {
    return BoundaryEvent
  } else if (props.type === 'bpmn:UserTask') {
    return UserTask
  } else if (props.type === 'bpmn:ServiceTask') {
    return ServiceTask
  } else if (props.type === 'bpmn:ScriptTask') {
    return ScriptTask
  } else if (props.type === 'bpmn:ReceiveTask') {
    return ReceiveTask
  } else if (props.type === 'bpmn:Task') {
    return Task
  } else if (
    [
      'bpmn:ExclusiveGateway',
      'bpmn:ParallelGateway',
      'bpmn:Participant',
      'bpmn:DataStoreReference',
      'bpmn:DataObjectReference',
      'bpmn:SubProcess',
      'bpmn:IntermediateThrowEvent',
      'bpmn:Lane'
    ].includes(props.type)
  ) {
    return Base
  }
  return NoUser
})
</script>

<style lang="scss">
.property-panel {
  padding: 20px 10px;
  .node-name {
    position: relative;
  }

  .node-name span {
    display: block;
    line-height: 24px;
    margin-bottom: 10px;
    font-size: 14px;
    color: $default-theme-color;
    padding-left: 10px;
  }

  .node-name i {
    width: 4px;
    height: 24px;
    content: ' ';
    position: absolute;
    left: 0px;
    top: 0px;
    border-radius: 3px;
    background: $default-theme-color;
  }
}
</style>
