// trim.ts 文件
import { type Directive } from 'vue'
// 过滤前后空格的指令 v-trim
export const trim: Directive = {
  mounted(el, binding) {
    console.log(el, 'elel')
    const inputObj = el.getElementsByTagName('input')[0]
    console.log(binding, 'binding')
    inputObj.oninput = () => {
      console.log(el.value, 'el.value')
      if (el.value) {
        el.value = el.value.trim()
      } else {
        el.value = ''
      }
    }
    // 当 input 失去焦点时去除两边空格
    // el.addEventListener('blur', function () {
    //   if (el.tagName.toUpperCase() === 'INPUT') {
    //     el.value = el.value.trim();
    //   }
    // });
  }
}
