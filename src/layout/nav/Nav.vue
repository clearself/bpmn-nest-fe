<template>
  <div class="ub ub-ac content_nav">
    <div class="map-marker">
      <i class="iconfont icon-map-marker" />
    </div>
    <Breadcrumb class="breadcrumb" />
  </div>
</template>
<script lang="ts" setup>
import Breadcrumb from '../components/Breadcrumb/index.vue'
</script>
<style lang="scss" scoped>
.content_nav {
  flex: 0 0 40px;
  display: flex;
  overflow: hidden;
  padding-left: 16px;
  background-color: #fff;
  // transparentize($default-theme-color, 0.96);
  font-size: 12px;
  line-height: 40px;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.8);
}
.map-marker {
  margin-right: 5px;
}
.map-marker i {
  font-size: 12px;
  color: $default-theme-color;
}
.breadcrumb {
  line-height: 23px;
}
</style>
