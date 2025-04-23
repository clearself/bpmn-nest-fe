<template>
  <div class="w100 h100 router-wrapper">
    <RouterView v-slot="{ Component, route }" class="w100 h100">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
    <!-- <router-view /> -->
  </div>
</template>
<script lang="ts" setup scoped></script>
<style lang="scss" scoped>
.router-wrapper {
  box-sizing: border-box;
}
</style>
