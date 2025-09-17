import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'permission',
    name: 'Permission',
    component: () => import('@/views/permission/index'),
    meta: { title: '权限', icon: 'lock' }
  }]
}
