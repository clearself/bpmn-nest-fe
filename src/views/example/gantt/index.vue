<template>
  <div style="height: 100%; background-color: white">
    <Gatt1 v-if="isRender" />
    <!-- <Gatt2 :tasks="tasks" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

import Gatt1 from './Gatt1.vue'
const isRender = ref(true)
onBeforeUnmount(() => {
  isRender.value = false
})
// import Gatt2 from './Gatt2.vue'
// import { getData } from './data'
// const tasks = ref(getData())
</script>
<style lang="scss" scoped></style>
