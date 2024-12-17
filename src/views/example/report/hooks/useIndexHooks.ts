export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'report.columns.num',
      dataIndex: 'num',
      width: 100,
      ellipsis: true
    },
    {
      lang: 'report.columns.path',
      dataIndex: 'path',
      ellipsis: true
    },
    {
      lang: 'report.columns.url',
      dataIndex: 'url',
      ellipsis: true
    },
    {
      lang: 'report.columns.remark',
      dataIndex: 'remark',
      ellipsis: true
    },
    {
      lang: 'report.columns.createTime',
      dataIndex: 'createTime',
      width: 150,
      ellipsis: true
    },
    {
      lang: 'report.columns.updateTime',
      dataIndex: 'updateTime',
      width: 150,
      ellipsis: true
    }
    // {
    //   lang: 'columns.operation',
    //   dataIndex: 'operation',
    //   width: 100
    // }
  ]

  return {
    columns
  }
}
