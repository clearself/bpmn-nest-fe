<template>
  <div class="w100 h100">
    <div class="header-wrapper">
      <Header />
    </div>
    <div class="ub w100 main">
      <Menu />
      <div class="h100 right-box">
        <Nav />
        <div class="right-content" :class="{ collapsed: collapsed }">
          <Content />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup scoped>
import { ref, onMounted } from 'vue'
import Bus from '@/bus'
import Header from '@/layout/header/Header.vue'
import Menu from '@/layout/menu/Menu.vue'
import Nav from '@/layout/nav/Nav.vue'
import Content from '@/layout/content/Content.vue'
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
  position: fixed;
  left: 0;
  top: 0;
}
.main {
  margin-top: 50px;
  height: calc(100vh - 50px);
  .right-box {
    box-sizing: border-box;
    background-color: rgb(242, 243, 245);
    padding: 0px 10px 0px 10px;
  }
  .right-content {
    margin-top: 10px;
    width: calc(100vw - 190px);
    height: calc(100% - 50px);
    padding-bottom: 10px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 5px;
    box-sizing: border-box;
    transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
    &.collapsed {
      width: calc(100vw - 100px);
    }
  }
}
</style>
