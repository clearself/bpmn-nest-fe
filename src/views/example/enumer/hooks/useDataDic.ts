export const useList = () => {
  // 设置列
  const columns = [
    {
      lang: 'columns.index',
      dataIndex: 'index',
      fixed: 'left',
      width: 50
    },
    {
      lang: 'example.columns.name',
      dataIndex: 'name',
      ellipsis: true
    },
    {
      lang: 'example.columns.content',
      dataIndex: 'content',
      ellipsis: true
    }
  ]

  return {
    columns
  }
}
