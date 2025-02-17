export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'dict.columnsData.dictTag',
      dataIndex: 'dictLabel',
      ellipsis: true
    },
    {
      lang: 'dict.columnsData.dictKey',
      dataIndex: 'dictValue',
      ellipsis: true
    },
    {
      lang: 'dict.columnsData.dictRank',
      dataIndex: 'dictSort',
      ellipsis: true
    },
    {
      lang: 'dict.columnsData.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'dict.columnsData.createTime',
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
