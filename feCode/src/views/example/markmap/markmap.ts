import { loadJS, loadCSS } from 'markmap-common'
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'

export const transformer = new Transformer()
const { scripts, styles } = transformer.getAssets()
// 确保 styles 和 scripts 都不为 undefined
if (styles) {
  loadCSS(styles)
}
if (scripts) {
  loadJS(scripts, { getMarkmap: () => markmap })
}
