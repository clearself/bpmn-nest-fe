export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'config.columns.configName',
      dataIndex: 'configName',
      width: 280,
      ellipsis: true
    },
    {
      lang: 'config.columns.configKey',
      dataIndex: 'configKey',
      width: 230,
      ellipsis: true
    },
    {
      lang: 'config.columns.configValue',
      dataIndex: 'configValue',
      width: 200,
      ellipsis: true
    },
    {
      lang: 'config.columns.configType',
      dataIndex: 'configType',
      width: 150,
      ellipsis: true
    },
    {
      lang: 'config.columns.remark',
      dataIndex: 'remark',
      ellipsis: true
    },
    {
      lang: 'config.columns.createTime',
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
