// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '设备管理',
    icon: 'folder-o',
    children: [
      { path: '/demo/page1', title: '设备列表' },
      { path: '/demo/page2', title: '增加设备' },
      { path: '/demo/page3', title: '设备详情' }
    ]
  },
  {
    title: '系统警告',
    icon: 'folder-o',
    children: [
      { path: '/demo/page1', title: '设备列表' },
      { path: '/demo/page2', title: '增加设备' },
      { path: '/demo/page3', title: '设备详情' }
    ]
  }
]
