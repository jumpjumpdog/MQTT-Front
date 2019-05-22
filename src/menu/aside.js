// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '设备管理',
    icon: 'folder-o',
    children: [
      { path: '/demo/page1', title: '设备清单' },
      { path: '/demo/page2', title: '设备注册' },
      { path: '/demo/page3', title: '设备详情' }
    ]
  },
  {
    title: '用户管理',
    icon: 'folder-o',
    children: [
      { path: '/demo/page4', title: '员工清单' },
      { path: '/demo/page5', title: '员工注册' },
      { path: '/demo/page6', title: '员工详情' }
    ]
  }
]
