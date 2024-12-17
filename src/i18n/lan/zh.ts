import global from './global/zh'
import login from './login/zh'
// 数据管理
import example from './example/zh'

// 系统设置
// 部门管理
import dept from './system/dept/zh'
// 岗位管理
import post from './system/post/zh'
// 菜单管理
import menu from './system/menu/zh'
// 角色管理
import role from './system/role/zh'
// 用户管理
import user from './system/user/zh'
// 字典管理
import dict from './system/dict/zh'
// 参数管理
import config from './system/config/zh'
// 公告通知管理
import notice from './system/notice/zh'

// 登录日志
import logininfo from './monitor/logininfo/zh'

// 统计上报管理
import report from './report/zh'
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
