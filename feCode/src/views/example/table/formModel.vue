<template>
  <div class="modal-wrapper" ref="mymodal">
    <a-modal
      :getContainer="() => $refs.mymodal"
      v-model:open="showValue"
      :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
      width="500px"
      :cancelText="$t('opts.cancel')"
      :okText="$t('opts.sure')"
      :afterClose="afterClose"
      @ok="handleOk"
    >
      <watermark>
        <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
          <a-form-item
            :label="$t('example.table.logisticsCompanyName')"
            name="logisticsCompanyName"
            :rules="rulesRef.logisticsCompanyName"
          >
            <a-input
              allowClear
              :maxlength="50"
              :placeholder="$t('placeholder7')"
              v-model:value.trim="formData.logisticsCompanyName"
            />
          </a-form-item>
          <a-form-item
            :label="$t('example.table.logisticsMethods')"
            name="logisticsMethods"
            :rules="rulesRef.logisticsMethods"
          >
            <a-input
              allowClear
              :maxlength="50"
              :placeholder="$t('placeholder7')"
              v-model:value.trim="formData.logisticsMethods"
            />
          </a-form-item>
          <a-form-item :label="$t('example.table.logisticsTrackingNumber')">
            <a-input
              allowClear
              :maxlength="100"
              :placeholder="$t('placeholder9')"
              v-model:value.trim="formData.logisticsTrackingNumber"
            />
          </a-form-item>
          <a-form-item :label="$t('example.table.deliveryNo')">
            <a-input
              allowClear
              :maxlength="100"
              :placeholder="$t('placeholder9')"
              v-model:value.trim="formData.trackingNo"
            />
          </a-form-item>
          <a-form-item :label="$t('example.table.contacts')" name="contacts" :rules="rulesRef.contacts">
            <a-input
              allowClear
              :maxlength="50"
              :placeholder="$t('placeholder7')"
              v-model:value.trim="formData.contacts"
            />
          </a-form-item>
          <a-form-item
            :label="$t('example.table.contactInformation')"
            name="contactPhone"
            :rules="rulesRef.contactPhone"
          >
            <a-input
              allowClear
              :maxlength="50"
              :placeholder="$t('placeholder7')"
              v-model:value.trim="formData.contactPhone"
            />
          </a-form-item>

          <a-form-item :label="$t('example.table.licensePlateNumber')">
            <a-input
              allowClear
              :maxlength="50"
              :placeholder="$t('placeholder7')"
              v-model:value.trim="formData.licensePlateNumber"
            />
          </a-form-item>
          <a-form-item :label="$t('example.table.remark')">
            <a-textarea
              :maxlength="100"
              showCount
              allowClear
              :placeholder="$t('placeholder9')"
              v-model:value.trim="formData.remark"
            />
          </a-form-item>
        </a-form>
      </watermark>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { saveDataProp } from './type'
import { add } from './server'
const emit = defineEmits(['update:show', 'success'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'add'
  },
  detailInfo: {
    type: Object,
    default: () => {}
  },
  curData: {
    type: Object,
    default: () => {}
  }
})
const formRef = ref()

interface formDataProp {
  id: string
  logisticsCompanyName: string
  logisticsMethods: string
  contacts: string
  contactPhone: string
  logisticsTrackingNumber: string
  licensePlateNumber: string
  trackingNo: string
  remark: string
}
const formData = reactive<formDataProp>({
  id: '',
  logisticsCompanyName: '',
  logisticsMethods: '',
  contacts: '',
  contactPhone: '',
  logisticsTrackingNumber: '',
  licensePlateNumber: '',
  trackingNo: '',
  remark: ''
})
const resetForm = () => {
  formData.id = ''
  formData.logisticsCompanyName = ''
  formData.logisticsMethods = ''
  formData.contacts = ''
  formData.contactPhone = ''
  formData.logisticsTrackingNumber = ''
  formData.licensePlateNumber = ''
  formData.trackingNo = ''
  formData.remark = ''
}
const rulesRef = reactive({
  logisticsCompanyName: [
    {
      required: true,
      message: $t('placeholder7')
    }
  ],
  logisticsMethods: [
    {
      required: true,
      message: $t('placeholder7')
    }
  ],
  contacts: [
    {
      required: true,
      message: $t('placeholder7')
    }
  ],
  contactPhone: [
    {
      required: true,
      message: $t('placeholder7')
    }
  ]
})
watchEffect(() => {
  if (props.show && props.status === 'edit') {
    formData.id = props.curData.id
    formData.logisticsCompanyName = props.curData.logistics_company
    formData.logisticsMethods = props.curData.logistics_method
    formData.contacts = props.curData.contacts
    formData.contactPhone = props.curData.contact_phone
    formData.logisticsTrackingNumber = props.curData.logistics_number
    formData.licensePlateNumber = props.curData.license_plate_number
    formData.trackingNo = props.curData.tracking_no
    formData.remark = props.curData.remark
  }
})
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
const afterClose = () => {
  resetForm()
}

const handleOk = async () => {
  formRef.value
    .validate()
    .then(async () => {
      const params: saveDataProp = {
        logisticsCompany: formData.logisticsCompanyName,
        logisticsMethod: formData.logisticsMethods,
        contacts: formData.contacts,
        contactPhone: formData.contactPhone,
        logisticsNumber: formData.logisticsTrackingNumber,
        licensePlateNumber: formData.licensePlateNumber,
        trackingNo: formData.trackingNo,
        remark: formData.remark
      }
      if (props.status === 'edit') {
        params.id = props?.curData?.id
      }
      const reponse = await add(params)
      if (reponse?.code === 0) {
        showValue.value = false
        message.success($t('opeateSuccess'))
        emit('success')
      }
    })
    .catch((error: any) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped>
.select-box {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 14px;
  line-height: 1.5714285714285714;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}
</style>
