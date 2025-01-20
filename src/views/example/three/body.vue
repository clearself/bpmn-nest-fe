<template>
  <div ref="canvasContainer" class="canvas-container" />
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvasContainer = ref(null)

onMounted(() => {
  let scene, camera, renderer, model
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let selectedPart = null
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }

  const init = () => {
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeeeeee)
    const width = canvasContainer.value.clientWidth
    const height = canvasContainer.value.clientHeight
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, 1 / 1, 0.1, 1000)
    camera.position.set(0, 1.6, 7) // 相机位置

    // 创建渲染器，并设置大小为500px × 500px
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    canvasContainer.value.appendChild(renderer.domElement)

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 10, 8.5)
    scene.add(light)

    // 加载3D模型
    const loader = new GLTFLoader()
    loader.load('/models/skeleton/scene.gltf', (gltf) => {
      model = gltf.scene
      scene.add(model)
    })

    // 鼠标事件监听
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMoveRotation)
  }

  const onMouseMove = (event) => {
    // 将鼠标位置标准化为Three.js坐标
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      if (selectedPart) {
        // 恢复之前选中的部件颜色
        selectedPart.material.emissive.setHex(selectedPart.currentHex)
      }

      selectedPart = intersects[0].object
      selectedPart.currentHex = selectedPart.material.emissive.getHex()
      selectedPart.material.emissive.setHex(0xff0000) // 悬浮变色
    } else if (selectedPart) {
      // 鼠标离开时恢复颜色
      selectedPart.material.emissive.setHex(selectedPart.currentHex)
      selectedPart = null
    }
  }

  const onClick = (event) => {
    if (selectedPart) {
      console.log(`你点击了: ${selectedPart.name}`)
    }
  }

  const onMouseDown = () => {
    isDragging = true
  }

  const onMouseUp = () => {
    isDragging = false
  }

  const onMouseMoveRotation = (event) => {
    if (isDragging) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      }

      const rotationSpeed = 0.005
      model.rotation.y += deltaMove.x * rotationSpeed
      model.rotation.x += deltaMove.y * rotationSpeed
    }

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  init()
  animate()
})
</script>

<style>
.canvas-container {
  width: 1000px;
  height: 88vh;
  overflow: hidden;
  margin: 0 auto;
  /* 居中对齐 */
}
</style>
