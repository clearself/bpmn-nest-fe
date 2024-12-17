export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      width: 50
    },
    {
      lang: 'logininfo.columns.visitNo',
      dataIndex: 'infoId',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.userName',
      dataIndex: 'userName',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.address',
      dataIndex: 'ipaddr',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.location',
      dataIndex: 'loginLocation',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.system',
      dataIndex: 'os',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.browser',
      dataIndex: 'browser',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.state',
      dataIndex: 'status',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.desc',
      dataIndex: 'msg',
      ellipsis: true
    },
    {
      lang: 'logininfo.columns.visitTime',
      dataIndex: 'loginTime',
      ellipsis: true
    }
  ]

  return {
    columns
  }
}
