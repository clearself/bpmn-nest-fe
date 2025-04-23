import type { Ref, ComputedRef } from 'vue'
import { computed, nextTick, ref, onMounted, onUnmounted } from 'vue'
import type { ScrollbarInstance } from 'element-plus'
import { is } from 'bpmn-js/lib/util/ModelUtil'
// type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  isBottom: Ref<boolean>
  scrollOffset: Ref<number>
  scrollRef: Ref<ScrollbarInstance | undefined>
  scrollToBottom: () => Promise<void>
  scrollToTop: () => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
}

export function useScroll(): ScrollReturn {
  const scrollRef = ref<ScrollbarInstance>()
  const scrollOffset = ref(0)
  const isBottom = ref(false)
  let scrollListener: (() => void) | null = null

  onMounted(() => {
    if (scrollRef.value && scrollRef.value.wrapRef) {
      scrollListener = () => {
        if (scrollRef.value) {
          const scrollHeight = scrollRef.value?.wrapRef?.scrollHeight || 0
          const threshold = 100 // Threshold, indicating the distance threshold to the bottom of the scroll bar.
          scrollOffset.value =
            scrollHeight - scrollRef.value?.wrapRef?.scrollTop! - scrollRef.value?.wrapRef?.clientHeight!
          isBottom.value = scrollOffset.value >= threshold
        }
      }
      scrollRef.value.wrapRef.addEventListener('scroll', scrollListener)
    }
  })

  onUnmounted(() => {
    if (scrollRef.value && scrollRef.value.wrapRef && scrollListener) {
      scrollRef.value.wrapRef.removeEventListener('scroll', scrollListener)
    }
  })

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value) scrollRef.value.setScrollTop(scrollRef.value?.wrapRef?.scrollHeight || 0)
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value) scrollRef.value.setScrollTop(0)
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const scrollHeight: number = scrollRef.value?.wrapRef?.scrollHeight || 0
      const threshold = 140 // Threshold, indicating the distance threshold to the bottom of the scroll bar.
      const distanceToBottom =
        scrollHeight - scrollRef?.value?.wrapRef?.scrollTop! - scrollRef?.value?.wrapRef?.clientHeight!
      if (distanceToBottom <= threshold) scrollRef.value.setScrollTop(scrollHeight)
    }
  }

  return {
    isBottom,
    scrollOffset,
    scrollRef,
    scrollToBottom,
    scrollToTop,
    scrollToBottomIfAtBottom
  }
}
