export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'role.columns.roleName',
      dataIndex: 'roleName',
      ellipsis: true
    },
    {
      lang: 'role.columns.roleKey',
      dataIndex: 'roleKey',
      ellipsis: true
    },
    {
      lang: 'role.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'role.columns.createTime',
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
