export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'dept.columns.deptName',
      dataIndex: 'deptName',
      ellipsis: true
    },
    {
      lang: 'dept.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'dept.columns.createTime',
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
