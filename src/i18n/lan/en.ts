import global from './global/en'
import login from './login/en'
// 数据管理
import example from './example/en'
// 系统设置
// 部门管理
import dept from './system/dept/en'
// 岗位管理
import post from './system/post/en'
// 菜单管理
import menu from './system/menu/en'
// 角色管理
import role from './system/role/en'
// 用户管理
import user from './system/user/en'
// 字典管理
import dict from './system/dict/en'
// 参数管理
import config from './system/config/en'
// 公告通知管理
import notice from './system/notice/en'
// 登录日志
import logininfo from './monitor/logininfo/en'
// 统计上报管理
import report from './report/en'
export default {
  ...global,
  ...login,
  ...example,
  ...dept,
  ...post,
  ...menu,
  ...role,
  ...user,
  ...dict,
  ...config,
  ...notice,
  ...logininfo,
  ...report
}
