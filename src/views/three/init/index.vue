<template>
  <div id="three-dom" ref="screenDom" />
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const screenDom = ref()
// 创建3D场景对象Scene
const scene = new THREE.Scene()
const gui = new dat.GUI()

onMounted(() => {
  init()
})
/**
 * @description: 检查渲染器的canvas尺寸是不是和canvas的显示尺寸不一样
 * @param {*} renderer
 * @return {*}
 */
const resizeRendererToDisplaySize = (renderer: any) => {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

const init = () => {
  // 透视摄像机
  const camera = new THREE.PerspectiveCamera(50, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.5, 3000)
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 反锯齿
  })
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
  screenDom.value.appendChild(renderer.domElement)
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // 贴纹理
  const textureLoader = new THREE.TextureLoader()
  const loaderTexture = textureLoader.load('/images/wall.jpg')
  // 以图片中心旋转45度
  loaderTexture.center.set(0.5, 0.5)
  loaderTexture.rotation = Math.PI / 4
  const material = new THREE.MeshPhongMaterial({
    // color: 0xFF8844,
    map: loaderTexture
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5

  // 加光线
  const lightColor = 0xffffff
  const intensity = 1
  const light = new THREE.DirectionalLight(lightColor, intensity)
  light.position.set(-1, 2, 4)
  scene.add(light)

  // 添加控制器
  gui.add(cube.position, 'x').min(0).max(5)

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', () => {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      console.log('--', camera.aspect)

      camera.updateProjectionMatrix()
      renderer.setPixelRatio(window.devicePixelRatio)
    }
  })
}
</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
  box-sizing: border-box;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
