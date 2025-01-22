<template>
  <div class="w100 h100 ub ub-ver">
    <div class="input-box">
      <a-textarea :rows="10" v-model:value="searchVal" />
    </div>
    <svg class="ub ub-f1 view-box" ref="svgRef">&nbsp;</svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Markmap } from 'markmap-view'
import { transformer } from './markmap'

const initValue = `# markMap

- beautiful
- useful
- easy
- interactive
`

const svgRef = ref<SVGElement | null>(null)
const searchVal = ref(initValue)
let mm: Markmap | null = null

const sanitizeInput = (input: string): string => {
  // 简单的HTML转义示例，实际应用中应使用更健壮的库
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const transformData = () => {
  try {
    const sanitizedInput = sanitizeInput(searchVal.value)
    const { root } = transformer.transform(sanitizedInput)
    return root
  } catch (error) {
    console.error('Transform error:', error)
    return null
  }
}

const updateMarkmap = (root: any) => {
  if (mm) {
    try {
      mm.setData(root)
      mm.fit()
    } catch (error) {
      console.error('Markmap update error:', error)
    }
  }
}

const update = () => {
  const root = transformData()
  if (root) {
    updateMarkmap(root)
  }
}

onMounted(() => {
  if (svgRef.value) {
    mm = Markmap.create(svgRef.value)
    update()
  } else {
    console.error('SVG element not found')
  }
})

watch(searchVal, () => {
  update()
})
</script>

<style scoped lang="scss">
.input-box {
  height: 300px;
}
.view-box {
  height: calc(100vh - 400px);
}
</style>
