import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/demo',
  name: 'demo',
  meta,
  redirect: { name: 'demo-page1' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'page1', name: `${pre}page1`, component: () => import('@/pages/demo/page1'), meta: { ...meta, title: '设备清单' } },
    { path: 'page2', name: `${pre}page2`, component: () => import('@/pages/demo/page2'), meta: { ...meta, title: '设备注册' } },
    { path: 'page3', name: `${pre}page3`, component: () => import('@/pages/demo/page3'), meta: { ...meta, title: '设备详情' } },
    { path: 'page4', name: `${pre}page4`, component: () => import('@/pages/demo/page4'), meta: { ...meta, title: '员工清单' } },
    { path: 'page5', name: `${pre}page5`, component: () => import('@/pages/demo/page5'), meta: { ...meta, title: '员工注册' } },
    { path: 'page6', name: `${pre}page6`, component: () => import('@/pages/demo/page6'), meta: { ...meta, title: '员工详情' } }
  ])('demo-')
}
