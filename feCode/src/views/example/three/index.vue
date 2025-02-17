<template>
  <div class="canvas-container">
    <model-viewer
      id="my-model-viewer"
      src="/models/skeleton/scene.gltf"
      ref="modelViewer"
      style="width: 100%; height: 100%"
      auto-rotate
      rotation-per-second="0deg"
      camera-controls
      :disable-zoom="true"
      interaction-prompt="none"
      disable-pan
      min-camera-orbit="0deg 90deg auto"
      max-camera-orbit="360deg 90deg auto"
    />
  </div>
</template>
<script setup lang="ts"></script>
<style>
.canvas-container {
  width: 1000px;
  height: 88vh;
  overflow: hidden;
  margin: 0 auto;
  /* 居中对齐 */
}
</style>
