export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'notice.columns.noticeTitle',
      dataIndex: 'noticeTitle',
      ellipsis: true
    },
    {
      lang: 'notice.columns.noticeType',
      dataIndex: 'noticeType',
      width: 150,
      ellipsis: true
    },
    {
      lang: 'notice.columns.state',
      dataIndex: 'status',
      width: 120,
      ellipsis: true
    },
    {
      lang: 'notice.columns.createBy',
      dataIndex: 'createBy',
      width: 150,
      ellipsis: true
    },
    {
      lang: 'notice.columns.createTime',
      dataIndex: 'createTime',
      width: 150,
      ellipsis: true
    },
    {
      lang: 'columns.operation',
      dataIndex: 'operation',
      width: 120
    }
  ]

  return {
    columns
  }
}
