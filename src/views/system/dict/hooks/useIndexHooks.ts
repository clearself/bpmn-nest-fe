export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'dict.columns.dictName',
      dataIndex: 'dictName',
      ellipsis: true
    },
    {
      lang: 'dict.columns.dictType',
      dataIndex: 'dictType',
      ellipsis: true
    },
    {
      lang: 'dict.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'dict.columns.createTime',
      dataIndex: 'createTime',
      ellipsis: true
    },
    {
      lang: 'columns.operation',
      dataIndex: 'operation'
    }
  ]

  return {
    columns
  }
}
