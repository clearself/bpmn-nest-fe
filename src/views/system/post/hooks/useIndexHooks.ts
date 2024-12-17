export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'post.columns.postCode',
      dataIndex: 'postCode',
      ellipsis: true
    },
    {
      lang: 'post.columns.postName',
      dataIndex: 'postName',
      ellipsis: true
    },
    {
      lang: 'post.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'post.columns.createTime',
      dataIndex: 'createTime',
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
