export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'menu.columns.menuName',
      dataIndex: 'menuName',
      ellipsis: true
    },
    {
      lang: 'menu.columns.icon',
      dataIndex: 'icon',
      ellipsis: true
    },
    {
      lang: 'menu.columns.sort',
      dataIndex: 'orderNum',
      ellipsis: true
    },
    {
      lang: 'menu.columns.permissionIdentification',
      dataIndex: 'perms',
      ellipsis: true
    },
    {
      lang: 'menu.columns.componentPath',
      dataIndex: 'component',
      ellipsis: true
    },
    {
      lang: 'menu.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'menu.columns.createTime',
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
