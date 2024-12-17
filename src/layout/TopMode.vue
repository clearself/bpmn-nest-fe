<template>
  <div class="w100">
    <div class="ub w100">
      <div class="ub ub-f1">
        <Menu />
      </div>
      <div style="width: auto">
        <Header />
      </div>
    </div>
    <Nav />
    <div class="w100 h50 pt-1" style="background-color: rgb(242, 243, 245); box-sizing: border-box">
      <div
        class="h100 bottom-content pb-1"
        style="
          overflow: hidden;
          margin: 0 10px 10px;
          background-color: #ffffff;
          border-radius: 5px;
          box-sizing: border-box;
        "
      >
        <Content />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup scoped>
import Header from '@/layout/header/Header.vue'
import Menu from '@/layout/menu/Menu.vue'
import Nav from '@/layout/nav/Nav.vue'
import Content from '@/layout/content/Content.vue'
</script>
<style lang="scss" scoped>
.h50 {
  height: calc(100vh - 80px);
}
.bottom-content {
  width: calc(100vw - 20px);
}
</style>
