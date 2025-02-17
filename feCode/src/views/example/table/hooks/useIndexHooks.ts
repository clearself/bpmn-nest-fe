export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.operation',
      dataIndex: 'operation',
      fixed: 'left',
      width: 120
    },
    {
      lang: 'columns.index',
      dataIndex: 'index',
      fixed: 'left',
      width: 50
    },
    {
      lang: 'example.table.logisticsCompanyName',
      dataIndex: 'logistics_company',
      ellipsis: true,
      width: 200
    },
    {
      lang: 'example.table.logisticsMethods',
      dataIndex: 'logistics_method',
      ellipsis: true
    },
    {
      lang: 'example.table.logisticsTrackingNumber',
      dataIndex: 'logistics_number',
      ellipsis: true
    },
    {
      lang: 'example.table.deliveryNo',
      dataIndex: 'tracking_no',
      ellipsis: true
    },
    {
      lang: 'example.table.contacts',
      dataIndex: 'contacts',
      ellipsis: true
    },
    {
      lang: 'example.table.contactInformation',
      dataIndex: 'contact_phone',
      ellipsis: true
    },

    {
      lang: 'example.table.licensePlateNumber',
      dataIndex: 'license_plate_number',
      ellipsis: true
    },
    {
      lang: 'example.table.remark',
      dataIndex: 'remark',
      ellipsis: true
    }
  ]

  return {
    columns
  }
}
