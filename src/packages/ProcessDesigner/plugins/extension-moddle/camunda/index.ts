'use strict'
import extension from './extension'
// module.exports = {
//   __init__: ['camundaModdleExtension'],
//   camundaModdleExtension: ['type', extension]
// }
export default {
  __init__: ['camundaModdleExtension'],
  camundaModdleExtension: ['type', extension]
}
