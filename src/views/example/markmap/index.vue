<template>
  <div class="flex flex-col h-screen p-2">
    <VueComposition />
  </div>
</template>

<script setup lang="ts">
import VueComposition from './vue-composition.vue'
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.0/dist/tailwind.min.css');

h1,
p {
  font-family: Lato;
}
</style>
