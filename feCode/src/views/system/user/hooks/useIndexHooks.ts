export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'user.columns.nickName',
      dataIndex: 'nickName',
      ellipsis: true
    },
    {
      lang: 'user.columns.userName',
      dataIndex: 'userName',
      ellipsis: true
    },
    {
      lang: 'user.columns.deptName',
      dataIndex: 'deptName',
      ellipsis: true
    },
    {
      lang: 'user.columns.phonenumber',
      dataIndex: 'phonenumber',
      ellipsis: true
    },
    {
      lang: 'user.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'user.columns.createTime',
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
