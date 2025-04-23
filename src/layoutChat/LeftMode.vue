<template>
  <div class="ub w100 main">
    <Menu />
    <div class="ub ub-f1 right-box">
      <div class="ub-f1 right-content">
        <Content />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup scoped>
import { ref, onMounted } from 'vue'
import Bus from '@/bus'
import Menu from '@/layoutChat/menu/Menu.vue'
import Content from '@/layoutChat/content/Content.vue'
const collapsed = ref(false)
onMounted(() => {
  Bus.on('collapsed', (data) => {
    collapsed.value = data as boolean
  })
})
</script>
<style lang="scss" scoped>
.header-wrapper {
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 999;
}
.main {
  height: 100vh;
  .right-box {
    box-sizing: border-box;
    background-color: rgb(242, 243, 245);
    padding: 0px 10px 0px 10px;
    position: relative;
  }
  .right-content {
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 5px;
    box-sizing: border-box;
  }
}
</style>
