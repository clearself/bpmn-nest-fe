<template>
  <a-watermark :content="[name, deptName]" :font="{ color: 'rgba(0, 0, 0, 0.1)' }">
    <slot />
  </a-watermark>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useUserStoreHook from '@/store/modules/user'
const userStore = useUserStoreHook()
const { name, deptName } = storeToRefs(userStore)
</script>

<style lang="scss" scoped></style>
