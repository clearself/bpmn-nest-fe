export default function userFilterOption() {
  // a-select 模糊搜索方法
  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  const filterOptionStatus = (input: string, option: any) => {
    const list = option.filter((item: any) => item.status === 1)
    return list.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  return {
    filterOption,
    filterOptionStatus
  }
}
