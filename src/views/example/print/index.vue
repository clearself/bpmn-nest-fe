<template>
  <div class="ub ub-ver w100">
    <div class="w100">
      <a-button @click="print">打印</a-button>
    </div>
    <div class="mt-3 print-box" id="print">
      <table class="formTable" border cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td class="first" colspan="4" style="border-right: none; border-bottom: none">
              Proforma invoice and Packing Slip
            </td>
          </tr>
          <tr class="two">
            <td class="two two-first">Ship From:</td>
            <td class="two" />
            <td class="two">Ship To:</td>
            <td class="two" />
          </tr>
          <tr class="three">
            <td class="three-first" colspan="2">发件人姓名:</td>
            <td class="three">OOM Company:</td>
            <td class="three no-bl" />
            <td class="three no-bl" />
          </tr>
          <tr class="three address">
            <td class="three-first" colspan="2">发件人详细地址:</td>
            <td class="three">Address:</td>
            <td class="three no-bl" />
            <td class="three no-bl" />
          </tr>
          <tr class="four">
            <td class="four">SO#:</td>
            <td class="three" colspan="3" />
          </tr>
          <tr class="four">
            <td class="four">Total Pallet:</td>
            <td class="three" colspan="3" />
          </tr>
          <tr class="four last">
            <td class="four">Tota! GW:</td>
            <td class="three" colspan="3" />
          </tr>
        </tbody>
      </table>

      <table class="dataTable" border cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(item, index) in heads" :key="index">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.field1 }}</td>
            <td>{{ item.field2 }}</td>
            <td>{{ item.field3 }}</td>
            <td>{{ item.field4 }}</td>
            <td>{{ item.field5 }}</td>
            <td>{{ item.field6 }}</td>
            <td>{{ item.field7 }}</td>
            <td>{{ item.field8 }}</td>
            <td>{{ item.field9 }}</td>
            <td>{{ item.field10 }}</td>
            <td>{{ item.field11 }}</td>
            <td>{{ item.field12 }}</td>
            <td>{{ item.field13 }}</td>
            <td>{{ item.field14 }}</td>
            <td>{{ item.field15 }}</td>
            <td>{{ item.field16 }}</td>
            <td>{{ item.field17 }}</td>
            <td>{{ item.field18 }}</td>
            <td>{{ item.field19 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import printJS from 'print-js'
const heads = ref([
  'temn',
  'MPN',
  'CPN',
  'ODM PO',
  'CN Descr',
  'HS Code',
  'Coo',
  'Qty(Pcs)',
  'Package',
  'Urit price',
  'Amount',
  'CCY',
  'Net Weight',
  'No of Carton',
  'Pallet ID',
  'Gross Weight',
  'Gross Length',
  'Width',
  'Height'
])
const tableData = [
  {
    field1: 'John Doe',
    field2: 'John Doe',
    field3: 'John Doe',
    field4: 'John Doe',
    field5: 'John Doe',
    field6: 'John Doe',
    field7: 'John Doe',
    field8: 'John Doe',
    field9: 'John Doe',
    field10: 'John Doe',
    field11: 'John Doe',
    field12: 'John Doe',
    field13: 'John Doe',
    field14: 'John Doe',
    field15: 'John Doe',
    field16: 'John Doe',
    field17: 'John Doe',
    field18: 'John Doe',
    field19: 'John Doe'
  }
]
// onMounted(() => {
//   nextTick(() => {
//     print()
//   })
// })
const print = () => {
  const style = `@page { margin: 0 } @media print {

    .print-box {
      width: 100%;
      padding: 0 3px;
      box-sizing: border-box;
    }
    .formTable {
      width:100%;
      border-color: #000;
    }
    .formTable td {
      width: 25%;
      text-indent: 5px;
      box-sizing: border-box;
      line-height: 30px;
      font-size:12px;
      border-color: #000;
    }

    .formTable tr>td.first{
      border-top:none;
      border-right:none;
      border-left:none;
      text-align:center;
      font-weight: bold;
    }
    .formTable tr>td.no-border{
      border:none;
    }
    .formTable tr.two > td:nth-child(odd) {
      width: 15%;
    }
    .formTable tr.two > td:nth-child(even) {
      width: 35%;
    }

    .formTable tr.two td.two.two-first {
      border-left: none;
    }
    .formTable tr.two td.two {
      border-right: none;
    }

    .formTable tr.three.address td {
      line-height: 40px;
    }
    .formTable tr.three td.three-first {
      border-left: none;
    }
    .formTable tr.three td {
      border-top: none;
      border-right: none;
    }
    .formTable tr.three td:last-child {
      border-left: none;
    }

    .formTable tr.three > td:nth-child(2) {
      width: 15%;
    }

    .formTable tr.four td {
      border-top: none;
      border-right: none;
    }
    .formTable tr.four td:first-child {
      width: 15%;
      border-left: none;
    }
    .formTable tr.four.last td {
      border-bottom: none;
    }


    .dataTable {
      margin-top: 10px;
      width: 100%;
      border-color: #000;
      box-sizing: border-box;
    }
    .dataTable thead tr > th:nth-child(1) {
      border-left: none;
    }

    .dataTable tr > td:nth-child(1) {
      border-left: none;
    }
    .dataTable thead tr > th {
      line-height: 30px;
      background-color: #f1f1f1;
      font-size: 12px;
      border-top:none;
      border-right:none;
    }
    .dataTable tr td {
      line-height: 30px;
      font-size: 12px;
      border-top: none;
      border-right: none;
    }
    .dataTable tbody > tr:last-child td {
      border-bottom: none;
    }
  }` //自定义样式
  printJS({
    printable: 'print', //要打印内容的id
    type: 'html',
    style: style,
    scanStyles: false
  })
}
</script>

<style lang="scss">
.custom-h3 {
  color: red;
}
.print-box {
  width: 100%;
  padding: 0 3px;
  box-sizing: border-box;
}
.formTable {
  width: 100%;
  border-color: #000;
}
.formTable td {
  width: 25%;
  text-indent: 5px;
  box-sizing: border-box;
  line-height: 30px;
  font-size: 12px;
  border-color: #000;
}
.formTable tr > td.first {
  border-top: none;
  border-right: none;
  border-left: none;
  text-align: center;
  font-weight: bold;
}
.formTable tr > td.no-border {
  border: none;
}
.formTable tr.two > td:nth-child(odd) {
  width: 15%;
}
.formTable tr.two > td:nth-child(even) {
  width: 35%;
}
.formTable tr.two td.two.two-first {
  border-left: none;
}
.formTable tr.two td.two {
  border-right: none;
}
.formTable tr.three.address td {
  line-height: 40px;
}

.formTable tr.three td.three-first {
  border-left: none;
}
.formTable tr.three td {
  border-top: none;
  border-right: none;
}
.formTable tr.three td:last-child {
  border-left: none;
}
.formTable tr.three > td:nth-child(2) {
  width: 15%;
}
.formTable tr.four td {
  border-top: none;
  border-right: none;
}

.formTable tr.four td:first-child {
  width: 15%;
  border-left: none;
}
.formTable tr.four.last td {
  border-bottom: none;
}
.dataTable {
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  border-color: #000;
}
.dataTable thead tr > th:nth-child(1) {
  border-left: none;
}

.dataTable tr > td:nth-child(1) {
  border-left: none;
}
.dataTable thead tr > th {
  line-height: 30px;
  font-size: 12px;
  border-top: none;
  border-right: none;
}
.dataTable tr td {
  line-height: 30px;
  font-size: 12px;
  border-top: none;
  border-right: none;
}
.dataTable tbody > tr:last-child td {
  border-bottom: none;
}
</style>
